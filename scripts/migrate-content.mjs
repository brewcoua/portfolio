/**
 * One-off migration: YAML content nodes -> markdown + frontmatter with
 * path-based identity ([[wikilinks]]). Run once, hand-review, then delete.
 *
 *   node scripts/migrate-content.mjs
 */
import { readFile, readdir, writeFile, rename } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');

const COLLECTIONS = ['projects', 'experience', 'education', 'technologies', 'skills', 'roles', 'publications'];

// Education files carry an `edu-` prefix we drop so filename === slug.
const slugFromFile = (type, base, parsed) => {
	if (type === 'education') return base.replace(/^edu-/, '');
	return parsed.slug ?? base;
};

/** Read everything first so we can resolve @id / @slug tokens to paths. */
async function loadAll() {
	const nodes = [];
	for (const type of COLLECTIONS) {
		let files = [];
		try {
			files = (await readdir(join(CONTENT, type))).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
		} catch {
			continue;
		}
		for (const file of files) {
			const base = file.replace(/\.ya?ml$/, '');
			const raw = await readFile(join(CONTENT, type, file), 'utf-8');
			const parsed = parse(raw) ?? {};
			const slug = slugFromFile(type, base, parsed);
			nodes.push({ type, file, base, slug, path: `${type}/${slug}`, parsed });
		}
	}
	return nodes;
}

function buildIndex(nodes) {
	const map = new Map();
	for (const n of nodes) {
		if (n.parsed.id) map.set(String(n.parsed.id).toLowerCase(), n.path);
		if (n.parsed.slug) map.set(String(n.parsed.slug).toLowerCase(), n.path);
		map.set(n.base.toLowerCase(), n.path);
		map.set(n.slug.toLowerCase(), n.path);
	}
	return map;
}

const wl = (path, text) => (text ? `[[${path}|${text}]]` : `[[${path}]]`);

/** [text](@token) -> [[path|text]] across any string value. */
function convertProse(value, index) {
	if (typeof value !== 'string') return value;
	return value.replace(/\[([^\]]+)\]\(@([^)]+)\)/g, (m, text, token) => {
		const path = index.get(String(token).trim().toLowerCase());
		if (!path) {
			console.warn(`  ! unresolved @${token}`);
			return m;
		}
		const seg = path.split('/').pop();
		return wl(path, text.trim() === seg ? undefined : text.trim());
	});
}

const deepProse = (v, index) => {
	if (typeof v === 'string') return convertProse(v, index);
	if (Array.isArray(v)) return v.map((x) => deepProse(x, index));
	if (v && typeof v === 'object') {
		const o = {};
		for (const [k, val] of Object.entries(v)) o[k] = deepProse(val, index);
		return o;
	}
	return v;
};

/** Resolve a reference id/slug to a `[[wikilink]]` string. */
const ref = (token, index) => {
	const path = index.get(String(token).trim().toLowerCase());
	if (!path) {
		console.warn(`  ! unresolved ref ${token}`);
		return `[[${token}]]`;
	}
	return `[[${path}]]`;
};

const refs = (arr, index) => (arr ?? []).map((t) => ref(t, index));

/** Split relationships[] into folded (tech/skill) and cross-type `related`. */
function splitRelationships(rels, index) {
	const related = [];
	const tech = [];
	const skills = [];
	for (const r of rels ?? []) {
		if (r.type === 'external') continue;
		if (r.type === 'technology') tech.push(ref(r.targetId, index));
		else if (r.type === 'skill') skills.push(ref(r.targetId, index));
		else related.push(ref(r.targetId, index));
	}
	return { related, tech, skills };
}

const dropEmpty = (obj) => {
	const o = {};
	for (const [k, v] of Object.entries(obj)) {
		if (v === undefined || v === null) continue;
		if (Array.isArray(v) && v.length === 0) continue;
		if (typeof v === 'string' && v.trim() === '') continue;
		o[k] = v;
	}
	return o;
};

function transform(node, index) {
	const p = deepProse(node.parsed, index);
	const rel = splitRelationships(node.parsed.relationships, index);
	let fm = {};
	let body = '';

	switch (node.type) {
		case 'projects': {
			fm = {
				title: p.title,
				subtitle: p.subtitle,
				abstract: p.abstract,
				status: p.status,
				featured: p.featured ?? false,
				date: p.date,
				duration: p.duration,
				role: ref(node.parsed.role, index),
				tech: [...refs(node.parsed.technologies, index), ...rel.tech],
				skills: [...refs(node.parsed.skills, index), ...rel.skills],
				related: rel.related,
				links: p.links,
				references: p.references,
				highlights: p.highlights,
				searchKeywords: p.searchKeywords
			};
			body = p.description ?? '';
			break;
		}
		case 'experience': {
			fm = {
				title: p.title,
				organization: p.organization,
				website: p.website,
				logo: p.logo,
				location: p.location,
				employmentType: p.employmentType,
				date: p.date,
				summary: p.summary,
				tech: [...refs(node.parsed.technologies, index), ...rel.tech],
				related: rel.related,
				details: p.details
			};
			break;
		}
		case 'education': {
			fm = {
				institution: p.institution,
				degree: p.degree,
				date: p.date,
				location: p.location,
				website: p.website,
				logo: p.logo,
				track: p.track,
				focus: p.focus,
				thesisTitle: p.thesisTitle,
				grade: p.grade,
				highlights: p.highlights,
				activities: p.activities,
				societies: p.societies,
				subEducation: p.subEducation,
				related: rel.related,
				tech: rel.tech,
				skills: rel.skills
			};
			break;
		}
		case 'technologies': {
			fm = {
				label: p.label,
				category: p.category,
				icon: p.icon,
				color: p.color,
				skills: [...rel.skills, ...rel.related],
				links: p.links
			};
			body = p.description ?? '';
			break;
		}
		case 'skills': {
			fm = {
				label: p.label,
				category: p.category,
				color: p.color,
				tech: [...rel.tech, ...rel.related],
				links: p.links
			};
			body = p.description ?? '';
			break;
		}
		case 'roles': {
			fm = { label: p.label, icon: p.icon, color: p.color };
			body = p.description ?? '';
			break;
		}
		case 'publications': {
			fm = { title: p.title, venue: p.venue, year: p.year, url: p.url, related: rel.related };
			break;
		}
	}

	return { fm: dropEmpty(fm), body: (body ?? '').trim() };
}

async function main() {
	const nodes = await loadAll();
	const index = buildIndex(nodes);

	for (const node of nodes) {
		console.log(`- ${node.path}`);
		const { fm, body } = transform(node, index);
		const yaml = stringify(fm, { lineWidth: 0 }).trimEnd();
		const out = `---\n${yaml}\n---\n${body ? `\n${body}\n` : ''}`;
		const newName = node.type === 'education' ? `${node.slug}.md` : `${node.base}.md`;
		await writeFile(join(CONTENT, node.type, newName), out, 'utf-8');
		// remove old yaml (rename to .md handled by new file; delete original)
		await rename(join(CONTENT, node.type, node.file), join(CONTENT, node.type, `${node.base}.yaml.bak`));
	}

	// profile singleton
	const profileRaw = parse(await readFile(join(CONTENT, 'profile.yaml'), 'utf-8'));
	const pp = deepProse(profileRaw, index);
	const roleNodes = new Set(nodes.filter((n) => n.type === 'roles').map((n) => n.slug));
	const profileFm = dropEmpty({
		name: pp.name,
		headline: pp.headline,
		location: pp.location,
		roles: pp.roles,
		skillsHighlight: (profileRaw.skillsHighlight ?? []).map((t) => ref(t, index)),
		links: pp.links
	});
	const profileBody = convertProse(profileRaw.summary ?? '', index).trim();
	await writeFile(
		join(CONTENT, 'profile.md'),
		`---\n${stringify(profileFm, { lineWidth: 0 }).trimEnd()}\n---\n\n${profileBody}\n`,
		'utf-8'
	);
	await rename(join(CONTENT, 'profile.yaml'), join(CONTENT, 'profile.yaml.bak'));

	console.log(`\nDone. ${nodes.length} nodes + profile migrated. Role nodes: ${[...roleNodes].join(', ')}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
