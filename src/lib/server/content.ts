import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import {
	renderMarkdownDoc,
	renderMarkdownInline,
	markdownDocToPlainText,
	type MentionDictionaries
} from '$lib/server/markdown/index';
import { WIKILINK_SCHEME, type MentionTarget } from '$lib/server/markdown/mentions';
import {
	COLLECTION_TYPES,
	FRONTMATTER_SCHEMAS,
	profileFrontmatter,
	siteConfig,
	parseWikilink,
	type CollectionDir,
	type ProfileFrontmatter
} from '$lib/content/schema';
import {
	EDUCATION_HONORS_GRADES,
	type EducationGrade,
	type EducationHonorsGrade,
	type Education,
	type EducationSubEntry,
	type Experience,
	type GraphData,
	type GraphLink,
	type GraphLinkKind,
	type GraphNode,
	type MarkdownInlineNode,
	type NodeType,
	type PortfolioContent,
	type Profile,
	type Project,
	type Publication,
	type Relationship,
	type RelationshipType,
	type Role,
	type SiteConfig,
	type Skill,
	type Technology
} from '$lib/content/types';

const CONTENT_DIR = join(process.cwd(), 'content');

let cached: PortfolioContent | null = null;

// --- Frontmatter reading -----------------------------------------------------

type RawNode = {
	dir: CollectionDir;
	type: NodeType;
	slug: string;
	path: string;
	data: Record<string, unknown>;
	body: string;
	label: string;
};

function splitFrontmatter(raw: string, label: string): { data: unknown; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) throw new Error(`${label}: missing frontmatter block`);
	return { data: parse(match[1]) ?? {}, body: match[2] ?? '' };
}

function validate(schema: z.ZodTypeAny, data: unknown, label: string): unknown {
	const result = schema.safeParse(data);
	if (!result.success) {
		const issues = result.error.issues
			.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
			.join('; ');
		throw new Error(`${label}: ${issues}`);
	}
	return result.data;
}

function labelFor(type: NodeType, data: Record<string, unknown>): string {
	if (type === 'education') return String(data.degree ?? '');
	if (type === 'project' || type === 'experience' || type === 'publication') {
		return String(data.title ?? '');
	}
	return String(data.label ?? '');
}

async function readCollection(dir: CollectionDir): Promise<RawNode[]> {
	const type = COLLECTION_TYPES[dir];
	let files: string[] = [];
	try {
		files = (await readdir(join(CONTENT_DIR, dir))).filter((file) => file.endsWith('.md'));
	} catch {
		return [];
	}
	return Promise.all(
		files.map(async (file) => {
			const slug = file.replace(/\.md$/, '');
			const path = `${dir}/${slug}`;
			const raw = await readFile(join(CONTENT_DIR, dir, file), 'utf-8');
			const { data, body } = splitFrontmatter(raw, path);
			const validated = validate(FRONTMATTER_SCHEMAS[dir], data, path) as Record<string, unknown>;
			return { dir, type, slug, path, data: validated, body, label: labelFor(type, validated) };
		})
	);
}

// --- Education grade normalization (ported, honors enum + fraction format) ----

const EDUCATION_HONORS_SET = new Set<string>(EDUCATION_HONORS_GRADES);
const GRADE_FRACTION_PATTERN = /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/;

function isEducationHonorsGrade(value: string): value is EducationHonorsGrade {
	return EDUCATION_HONORS_SET.has(value);
}

function normalizeGradeFraction(raw: string): string {
	const trimmed = raw.trim();
	if (!GRADE_FRACTION_PATTERN.test(trimmed)) {
		throw new Error(`Invalid grade fraction "${raw}" — use N/Nmax, e.g. 14/20 or 3.9/4.0`);
	}
	const [, a, b] = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/) ?? [];
	return `${a} / ${b}`;
}

function parseEducationGrade(raw: unknown, label: string): EducationGrade | undefined {
	if (raw === undefined || raw === null) return undefined;
	if (typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`${label}: grade must be a mapping with one of fraction | honors | label`);
	}
	const map = raw as Record<string, unknown>;
	const modes = ['fraction', 'honors', 'label'].filter(
		(key) => map[key] !== undefined && map[key] !== null && String(map[key]).trim() !== ''
	);
	if (modes.length === 0) return undefined;
	if (modes.length > 1) throw new Error(`${label}: grade must have exactly one of fraction, honors, or label`);

	if (map.fraction !== undefined) {
		return { kind: 'fraction', value: normalizeGradeFraction(String(map.fraction)) };
	}
	if (map.honors !== undefined) {
		const key = String(map.honors).trim();
		if (!isEducationHonorsGrade(key)) {
			throw new Error(`${label}: unknown grade.honors "${key}" — allowed: ${EDUCATION_HONORS_GRADES.join(', ')}`);
		}
		return { kind: 'honors', honors: key };
	}
	return { kind: 'label', label: String(map.label).trim() };
}

// --- Load + resolve ----------------------------------------------------------

export async function loadContent(): Promise<PortfolioContent> {
	if (cached) return cached;

	const dirs = Object.keys(COLLECTION_TYPES) as CollectionDir[];
	const collections = await Promise.all(dirs.map((dir) => readCollection(dir)));
	const nodes = collections.flat();

	const profileRaw = await readFile(join(CONTENT_DIR, 'profile.md'), 'utf-8');
	const profileSplit = splitFrontmatter(profileRaw, 'profile');
	const profileData = validate(profileFrontmatter, profileSplit.data, 'profile') as ProfileFrontmatter;

	const siteRaw = parse(await readFile(join(CONTENT_DIR, 'site.yaml'), 'utf-8'));
	const site = validate(siteConfig, siteRaw, 'site.yaml') as SiteConfig;

	// Resolution index (Obsidian-style: full path, or unique filename fallback).
	const byPath = new Map<string, RawNode>();
	const byFilename = new Map<string, string[]>();
	for (const node of nodes) {
		if (byPath.has(node.path)) throw new Error(`Duplicate node path: ${node.path}`);
		byPath.set(node.path, node);
		byFilename.set(node.slug, [...(byFilename.get(node.slug) ?? []), node.path]);
	}

	function resolveTarget(target: string, sourceLabel: string): string {
		const clean = target.trim();
		if (clean.includes('/')) {
			if (!byPath.has(clean)) throw new Error(`${sourceLabel}: unresolved link [[${clean}]]`);
			return clean;
		}
		const matches = byFilename.get(clean);
		if (!matches || matches.length === 0) {
			throw new Error(`${sourceLabel}: unresolved link [[${clean}]]`);
		}
		if (matches.length > 1) {
			throw new Error(`${sourceLabel}: ambiguous link [[${clean}]] — qualify with a folder (${matches.join(', ')})`);
		}
		return matches[0];
	}

	const resolveRef = (raw: string, sourceLabel: string): string => {
		const parsed = parseWikilink(raw);
		if (!parsed) throw new Error(`${sourceLabel}: invalid reference "${raw}"`);
		return resolveTarget(parsed.target, sourceLabel);
	};
	const resolveRefs = (arr: string[] | undefined, sourceLabel: string): string[] =>
		(arr ?? []).map((raw) => resolveRef(raw, sourceLabel));

	// Mention resolver (path -> link/popover) + display labels.
	const mentionDict = new Map<string, MentionTarget>();
	for (const node of nodes) {
		mentionDict.set(node.path, mentionTargetFor(node));
	}

	function mentionTargetFor(node: RawNode): MentionTarget {
		switch (node.type) {
			case 'project':
				return { kind: 'project', href: `/projects/${node.slug}` };
			case 'experience':
				return { kind: 'experience', href: `/experience/${node.slug}` };
			case 'education':
				return { kind: 'education', href: `/education/${node.slug}` };
			case 'publication':
				return { kind: 'publication', href: `/about#publication-${node.slug}` };
			case 'role':
				return { kind: 'role', href: '/projects' };
			case 'technology':
			case 'skill':
				return {
					kind: node.type,
					entityId: node.path,
					title: node.label,
					body: node.body.trim() ? markdownDocToPlainText(renderMarkdownDoc(node.body)) : `${node.label} mention`
				};
		}
	}

	/** Rewrite `[[target|alias]]` -> `[alias](wikilink:path)` and collect edge targets. */
	function preprocess(source: string, sourceLabel: string, collect: Set<string>): string {
		return source.replace(/\[\[([^\]]+)\]\]/g, (_match, inner: string) => {
			const pipe = inner.indexOf('|');
			const target = (pipe === -1 ? inner : inner.slice(0, pipe)).trim();
			const alias = pipe === -1 ? undefined : inner.slice(pipe + 1).trim();
			const path = resolveTarget(target, sourceLabel);
			collect.add(path);
			const text = alias ?? byPath.get(path)?.label ?? path;
			return `[${text}](${WIKILINK_SCHEME}${path})`;
		});
	}

	const renderDoc = (src: string | undefined, label: string, collect: Set<string>) =>
		renderMarkdownDoc(preprocess(src ?? '', label, collect), { mentions: mentionDict });
	const renderInline = (src: string | undefined, label: string, collect: Set<string>): MarkdownInlineNode[] =>
		renderMarkdownInline(preprocess(src ?? '', label, collect), { mentions: mentionDict });
	const renderInlineList = (arr: string[] | undefined, label: string, collect: Set<string>) =>
		(arr ?? []).map((item) => renderInline(item, label, collect));

	// --- Graph edges + derived relationships ---------------------------------

	const graphLinks: GraphLink[] = [];
	const linkSeen = new Set<string>();
	const relBuckets = new Map<string, Relationship[]>();
	const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

	function addRel(owner: string, target: string): void {
		if (!byPath.has(owner)) return; // owner must be an entity (excludes profile)
		const targetNode = byPath.get(target);
		if (!targetNode) return;
		const bucket = relBuckets.get(owner) ?? [];
		if (!bucket.some((r) => r.targetId === target)) {
			bucket.push({ type: targetNode.type as RelationshipType, targetId: target });
		}
		relBuckets.set(owner, bucket);
	}

	function addEdge(a: string, b: string, kind: GraphLinkKind): void {
		if (a === b) return;
		const key = pairKey(a, b);
		if (!linkSeen.has(key)) {
			linkSeen.add(key);
			graphLinks.push({ source: a, target: b, kind });
		}
		addRel(a, b);
		addRel(b, a);
	}

	const linkTargets = (from: string, targets: string[], kind: GraphLinkKind) => {
		for (const target of targets) addEdge(from, target, kind);
	};

	// --- Build runtime nodes -------------------------------------------------

	const projects: Project[] = [];
	const experience: Experience[] = [];
	const education: Education[] = [];
	const technologies: Technology[] = [];
	const skills: Skill[] = [];
	const roles: Role[] = [];
	const publications: Publication[] = [];

	for (const node of nodes) {
		const { data, path, slug, type, label } = node;
		const mentions = new Set<string>();

		if (type === 'project') {
			const role = resolveRef(String(data.role), path);
			const tech = resolveRefs(data.tech as string[], path);
			const skillPaths = resolveRefs(data.skills as string[], path);
			const related = resolveRefs(data.related as string[], path);
			const descriptionMarkdown = renderDoc(node.body, path, mentions);
			linkTargets(path, [role], 'role');
			linkTargets(path, tech, 'technology');
			linkTargets(path, skillPaths, 'skill');
			linkTargets(path, related, 'mention');
			projects.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				title: label,
				subtitle: data.subtitle as string | undefined,
				abstract: String(data.abstract),
				abstractMarkdown: renderDoc(String(data.abstract), path, mentions),
				status: data.status as Project['status'],
				kind: data.kind as Project['kind'],
				role,
				duration: data.duration as string | undefined,
				featured: Boolean(data.featured),
				thumbnail: data.thumbnail as string | undefined,
				description: node.body,
				descriptionMarkdown,
				technologies: tech,
				skills: skillPaths,
				links: (data.links as Project['links']) ?? [],
				references: data.references as Project['references'],
				highlights: (data.highlights as string[]) ?? [],
				highlightsMarkdown: renderInlineList(data.highlights as string[], path, mentions),
				searchKeywords: data.searchKeywords as string[] | undefined,
				date: data.date as Project['date']
			});
			linkTargets(path, [...mentions], 'mention');
			continue;
		}

		if (type === 'experience') {
			const tech = resolveRefs(data.tech as string[], path);
			const related = resolveRefs(data.related as string[], path);
			linkTargets(path, tech, 'technology');
			linkTargets(path, related, 'mention');
			experience.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				title: label,
				organization: String(data.organization),
				location: String(data.location),
				employmentType: String(data.employmentType),
				summary: String(data.summary),
				summaryMarkdown: renderDoc(String(data.summary), path, mentions),
				details: (data.details as string[]) ?? [],
				detailsMarkdown: renderInlineList(data.details as string[], path, mentions),
				technologies: tech,
				logo: data.logo as string | undefined,
				website: data.website as string | undefined,
				date: data.date as Experience['date']
			});
			linkTargets(path, [...mentions], 'mention');
			continue;
		}

		if (type === 'education') {
			const related = resolveRefs(data.related as string[], path);
			const tech = resolveRefs(data.tech as string[], path);
			const skillPaths = resolveRefs(data.skills as string[], path);
			linkTargets(path, tech, 'technology');
			linkTargets(path, skillPaths, 'skill');
			linkTargets(path, related, 'mention');
			const subEducation = (data.subEducation as Record<string, unknown>[] | undefined)?.map((sub, index) => {
				const subLabel = `${path} subEducation[${index}]`;
				return {
					institution: String(sub.institution),
					degree: String(sub.degree),
					location: String(sub.location),
					date: sub.date as EducationSubEntry['date'],
					track: (sub.track as string[]) ?? [],
					grade: parseEducationGrade(sub.grade, subLabel),
					highlights: (sub.highlights as string[]) ?? [],
					highlightsMarkdown: renderInlineList(sub.highlights as string[], subLabel, mentions),
					activities: (sub.activities as string[]) ?? [],
					activitiesMarkdown: renderInlineList(sub.activities as string[], subLabel, mentions),
					societies: (sub.societies as string[]) ?? [],
					societiesMarkdown: renderInlineList(sub.societies as string[], subLabel, mentions),
					logo: sub.logo as string | undefined,
					website: sub.website as string | undefined
				} satisfies EducationSubEntry;
			});
			education.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				institution: String(data.institution),
				degree: label,
				location: String(data.location),
				description: node.body,
				descriptionMarkdown: renderDoc(node.body, path, mentions),
				track: (data.track as string[]) ?? undefined,
				focus: (data.focus as string[]) ?? [],
				thesisTitle: data.thesisTitle as string | undefined,
				grade: parseEducationGrade(data.grade, path),
				highlights: (data.highlights as string[]) ?? [],
				highlightsMarkdown: renderInlineList(data.highlights as string[], path, mentions),
				activities: (data.activities as string[]) ?? [],
				activitiesMarkdown: renderInlineList(data.activities as string[], path, mentions),
				societies: (data.societies as string[]) ?? [],
				societiesMarkdown: renderInlineList(data.societies as string[], path, mentions),
				subEducation,
				logo: data.logo as string | undefined,
				website: data.website as string | undefined,
				date: data.date as Education['date']
			});
			linkTargets(path, [...mentions], 'mention');
			continue;
		}

		if (type === 'technology') {
			const skillPaths = resolveRefs(data.skills as string[], path);
			linkTargets(path, skillPaths, 'skill');
			technologies.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				label,
				category: String(data.category),
				icon: data.icon as string | undefined,
				color: data.color as string | undefined,
				description: node.body,
				descriptionMarkdown: renderInline(node.body, path, mentions),
				links: (data.links as Technology['links']) ?? []
			});
			continue;
		}

		if (type === 'skill') {
			const tech = resolveRefs(data.tech as string[], path);
			linkTargets(path, tech, 'technology');
			skills.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				label,
				category: String(data.category),
				color: data.color as string | undefined,
				description: node.body,
				descriptionMarkdown: renderInline(node.body, path, mentions),
				links: (data.links as Skill['links']) ?? []
			});
			continue;
		}

		if (type === 'role') {
			roles.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				label,
				icon: data.icon as string | undefined,
				color: data.color as string | undefined,
				description: node.body,
				descriptionMarkdown: renderInline(node.body, path, mentions)
			});
			continue;
		}

		if (type === 'publication') {
			const related = resolveRefs(data.related as string[], path);
			linkTargets(path, related, 'mention');
			publications.push({
				id: path,
				path,
				type,
				slug,
				relationships: [],
				title: label,
				venue: data.venue as string | undefined,
				year: data.year as number | undefined,
				url: data.url as string | undefined
			});
		}
	}

	// --- Profile (singleton, graph center) -----------------------------------

	const profileMentions = new Set<string>();
	const skillsHighlight = resolveRefs(profileData.skillsHighlight, 'profile');
	linkTargets('profile', skillsHighlight, 'technology');
	// Every role is a hat I wear — connect them all to the profile hub so each
	// role's projects hang off it (Me -> Role -> Project -> Tech/Skills).
	for (const role of roles) addEdge('profile', role.path, 'role');
	const profile: Profile = {
		id: 'profile',
		name: profileData.name,
		headline: profileData.headline,
		location: profileData.location,
		summary: profileSplit.body,
		summaryMarkdown: renderDoc(profileSplit.body, 'profile', profileMentions),
		roles: profileData.roles,
		links: profileData.links,
		skillsHighlight
	};
	linkTargets('profile', [...profileMentions], 'mention');

	// Career backbone: the profile hub always connects to every experience and
	// education entry, so the "who I am" story stays connected even when an entry
	// isn't referenced from prose (edges to entities not mentioned are cheap).
	for (const item of [...experience, ...education]) addEdge('profile', item.path, 'mention');

	// Attach derived relationships now that every edge is known.
	const allEntities = [...projects, ...experience, ...education, ...technologies, ...skills, ...roles, ...publications];
	for (const entity of allEntities) {
		entity.relationships = relBuckets.get(entity.path) ?? [];
	}

	// --- Graph data ----------------------------------------------------------

	const WEIGHTS: Record<NodeType | 'profile', number> = {
		profile: 3,
		project: 2.2,
		experience: 1.9,
		education: 1.9,
		role: 1.5,
		publication: 1.6,
		skill: 1.3,
		technology: 1
	};
	const graphNodes: GraphNode[] = [
		{ id: 'profile', type: 'profile', label: profile.name, url: '/about', color: undefined, weight: WEIGHTS.profile },
		...nodes.map((node) => ({
			id: node.path,
			type: node.type,
			label: node.label,
			url: graphUrlFor(node),
			color: node.data.color as string | undefined,
			icon: node.data.icon as string | undefined,
			weight: WEIGHTS[node.type]
		}))
	];
	// Drop links to any node that somehow isn't in the node set (defensive).
	const nodeIds = new Set(graphNodes.map((n) => n.id));
	const graph: GraphData = {
		nodes: graphNodes,
		links: graphLinks.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target))
	};

	cached = {
		profile,
		site,
		technologies,
		skills,
		roles,
		projects,
		experience,
		education,
		publications,
		graph
	};
	return cached;
}

function graphUrlFor(node: RawNode): string | undefined {
	if (node.type === 'project') return `/projects/${node.slug}`;
	if (node.type === 'experience') return `/experience/${node.slug}`;
	if (node.type === 'education') return `/education/${node.slug}`;
	return undefined; // technologies/skills/roles are popover-only
}
