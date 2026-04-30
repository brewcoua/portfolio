import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import type {
	DateValue,
	DateRangeOrSingleDate,
	Education,
	Experience,
	LinkItem,
	LinkType,
	PortfolioContent,
	Profile,
	Project,
	ProjectStatus,
	Publication,
	Relationship,
	RelationshipType,
	Role,
	Skill,
	SiteConfig,
	Technology
} from '$lib/content/types';

const CONTENT_DIR = join(process.cwd(), 'content');

let cached: PortfolioContent | null = null;

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0;

async function readYaml<T>(relativePath: string): Promise<T> {
	const content = await readFile(join(CONTENT_DIR, relativePath), 'utf-8');
	return parse(content) as T;
}

async function readYamlCollection<T>(relativeDir: string): Promise<T[]> {
	const dir = join(CONTENT_DIR, relativeDir);
	const files = (await readdir(dir)).filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'));
	const records = await Promise.all(files.map(async (file) => readYaml<T>(join(relativeDir, file))));
	return records;
}

function isIsoDate(value: string): boolean {
	return /^\d{4}-\d{2}(-\d{2})?$/.test(value);
}

function isHexColor(value: string): boolean {
	return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function isHttpsUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'https:';
	} catch {
		return false;
	}
}

function hostIncludes(value: string, hostNeedle: string): boolean {
	try {
		const url = new URL(value);
		return url.host.includes(hostNeedle);
	} catch {
		return false;
	}
}

function validateDateConfig(entity: DateRangeOrSingleDate, entityLabel: string): void {
	validateDateValue(entity.date, entityLabel);
}

function validateDateValue(date: DateValue, entityLabel: string): void {
	if (typeof date === 'string') {
		if (!isIsoDate(date)) throw new Error(`Invalid date format in ${entityLabel}: ${date}`);
		return;
	}

	const [start, end] = date;
	if (!isNonEmptyString(start) || !isIsoDate(start)) {
		throw new Error(`Invalid start date in ${entityLabel}: ${String(start)}`);
	}
	if (end !== undefined && (!isNonEmptyString(end) || !isIsoDate(end))) {
		throw new Error(`Invalid end date in ${entityLabel}: ${String(end)}`);
	}
}

const KNOWN_LINK_TYPES = new Set<LinkType>([
	'github',
	'demo',
	'docs',
	'paper',
	'article',
	'video',
	'package',
	'live',
	'design',
	'linkedin',
	'email',
	'custom'
]);

const KNOWN_PROJECT_STATUSES = new Set<ProjectStatus>(['completed', 'active', 'paused', 'archived']);

function validateLink(link: LinkItem, ownerLabel: string): void {
	if (!KNOWN_LINK_TYPES.has(link.type)) {
		throw new Error(`Unknown link type "${link.type}" in ${ownerLabel}`);
	}

	if (!isNonEmptyString(link.url)) {
		throw new Error(`Missing link URL in ${ownerLabel}`);
	}

	if (link.type === 'email') {
		if (!link.url.startsWith('mailto:')) {
			throw new Error(`Email link must start with mailto: in ${ownerLabel}`);
		}
		return;
	}

	if (!isHttpsUrl(link.url)) {
		throw new Error(`Link URL must be https in ${ownerLabel}: ${link.url}`);
	}

	if (link.type === 'github' && !hostIncludes(link.url, 'github.com')) {
		throw new Error(`GitHub link must point to github.com in ${ownerLabel}`);
	}
	if (link.type === 'linkedin' && !hostIncludes(link.url, 'linkedin.com')) {
		throw new Error(`LinkedIn link must point to linkedin.com in ${ownerLabel}`);
	}
	if (link.type === 'custom') {
		if (!isNonEmptyString(link.label) || !isNonEmptyString(link.icon)) {
			throw new Error(`Custom links require label and icon in ${ownerLabel}`);
		}
	}
}

function assertUnique(values: string[], label: string): void {
	const seen = new Set<string>();
	for (const value of values) {
		if (seen.has(value)) {
			throw new Error(`Duplicate ${label}: ${value}`);
		}
		seen.add(value);
	}
}

function validateCv(site: SiteConfig): void {
	const url = site.cv?.cvPdfUrl?.trim();
	if (!url) return;
	if (!url.startsWith('https://')) {
		throw new Error('Invalid cv.cvPdfUrl: must start with https://');
	}
}

type EntityKind = Exclude<RelationshipType, 'external'>;

type EntityIndexRecord = {
	kind: EntityKind;
	id: string;
};

function buildEntityIndex(content: PortfolioContent): Map<string, EntityIndexRecord> {
	const index = new Map<string, EntityIndexRecord>();
	const add = (kind: EntityKind, id: string): void => {
		if (index.has(id)) throw new Error(`Duplicate entity id across collections: ${id}`);
		index.set(id, { kind, id });
	};

	for (const project of content.projects) add('project', project.id);
	for (const experience of content.experience) add('experience', experience.id);
	for (const education of content.education) add('education', education.id);
	for (const publication of content.publications) add('publication', publication.id);
	for (const technology of content.technologies) add('technology', technology.id);
	for (const skill of content.skills) add('skill', skill.id);
	for (const role of content.roles) add('role', role.id);

	return index;
}

function validateRelationships(
	ownerLabel: string,
	relationships: Relationship[],
	index: Map<string, EntityIndexRecord>
): void {
	for (const relationship of relationships) {
		if (!isNonEmptyString(relationship.type)) {
			throw new Error(`Invalid relationship type in ${ownerLabel}`);
		}
		if (!isNonEmptyString(relationship.targetId)) {
			throw new Error(`Invalid relationship targetId in ${ownerLabel}`);
		}

		if (relationship.type === 'external') continue;

		const target = index.get(relationship.targetId);
		if (!target) {
			throw new Error(
				`Unknown relationship target "${relationship.targetId}" in ${ownerLabel} (expected ${relationship.type})`
			);
		}
		if (target.kind !== relationship.type) {
			throw new Error(
				`Relationship type mismatch in ${ownerLabel}: target "${relationship.targetId}" is ${target.kind}, not ${relationship.type}`
			);
		}
	}
}

function validateReferences(content: PortfolioContent): void {
	const technologyIds = new Set(content.technologies.map((item) => item.id));
	const skillIds = new Set(content.skills.map((item) => item.id));
	const roleIds = new Set(content.roles.map((item) => item.id));
	const index = buildEntityIndex(content);

	for (const project of content.projects) {
		validateDateConfig(project, `project ${project.id}`);
		if (!KNOWN_PROJECT_STATUSES.has(project.status)) {
			throw new Error(`Unknown status "${project.status}" in project ${project.id}`);
		}
		if (!roleIds.has(project.role)) {
			throw new Error(`Unknown role "${project.role}" in project ${project.id}`);
		}
		for (const tech of project.technologies) {
			if (!technologyIds.has(tech)) throw new Error(`Unknown technology "${tech}" in project ${project.id}`);
		}
		for (const skill of project.skills) {
			if (!skillIds.has(skill)) throw new Error(`Unknown skill "${skill}" in project ${project.id}`);
		}
		for (const link of project.links) {
			validateLink(link, `project ${project.id}`);
		}
		validateRelationships(`project ${project.id}`, project.relationships, index);
	}

	for (const experience of content.experience) {
		validateDateConfig(experience, `experience ${experience.id}`);
		for (const tech of experience.technologies) {
			if (!technologyIds.has(tech)) throw new Error(`Unknown technology "${tech}" in experience ${experience.id}`);
		}
		validateRelationships(`experience ${experience.id}`, experience.relationships, index);
	}

	for (const education of content.education) {
		validateDateConfig(education, `education ${education.id}`);
		for (const highlight of education.highlights) {
			if (!isNonEmptyString(highlight)) {
				throw new Error(`Invalid education highlight in ${education.id}`);
			}
		}
		for (const [index, subEducation] of (education.subEducation ?? []).entries()) {
			validateDateConfig(subEducation, `education ${education.id} subEducation ${index}`);
			if (!isNonEmptyString(subEducation.institution)) {
				throw new Error(`Invalid subEducation institution in ${education.id} at index ${index}`);
			}
			if (!isNonEmptyString(subEducation.degree)) {
				throw new Error(`Invalid subEducation degree in ${education.id} at index ${index}`);
			}
			if (!isNonEmptyString(subEducation.location)) {
				throw new Error(`Invalid subEducation location in ${education.id} at index ${index}`);
			}
			for (const highlight of subEducation.highlights) {
				if (!isNonEmptyString(highlight)) {
					throw new Error(
						`Invalid subEducation highlight in ${education.id} at index ${index}`
					);
				}
			}
		}
		validateRelationships(`education ${education.id}`, education.relationships, index);
	}

	for (const publication of content.publications) {
		validateRelationships(`publication ${publication.id}`, publication.relationships, index);
	}

	for (const technology of content.technologies) {
		validateRelationships(`technology ${technology.id}`, technology.relationships, index);
		if (technology.color && !isHexColor(technology.color)) {
			throw new Error(`Invalid technology color "${technology.color}" in ${technology.id}`);
		}
		for (const link of technology.links) {
			validateLink(link, `technology ${technology.id}`);
		}
	}

	for (const skill of content.skills) {
		validateRelationships(`skill ${skill.id}`, skill.relationships, index);
		if (skill.color && !isHexColor(skill.color)) {
			throw new Error(`Invalid skill color "${skill.color}" in ${skill.id}`);
		}
		for (const link of skill.links) {
			validateLink(link, `skill ${skill.id}`);
		}
	}

	for (const role of content.roles) {
		validateRelationships(`role ${role.id}`, role.relationships, index);
		if (role.color && !isHexColor(role.color)) {
			throw new Error(`Invalid role color "${role.color}" in ${role.id}`);
		}
	}
}

function validateCore(content: PortfolioContent): void {
	if (!isNonEmptyString(content.profile.id)) throw new Error('Invalid profile.id');
	if (!isNonEmptyString(content.profile.name)) throw new Error('Invalid profile.name');

	assertUnique(content.projects.map((item) => item.id), 'project id');
	assertUnique(content.projects.map((item) => item.slug), 'project slug');
	assertUnique(content.experience.map((item) => item.id), 'experience id');
	assertUnique(content.experience.map((item) => item.slug), 'experience slug');
	assertUnique(content.technologies.map((item) => item.id), 'technology id');
	assertUnique(content.technologies.map((item) => item.slug), 'technology slug');
	assertUnique(content.skills.map((item) => item.id), 'skill id');
	assertUnique(content.skills.map((item) => item.slug), 'skill slug');
	assertUnique(content.roles.map((item) => item.id), 'role id');
	assertUnique(content.roles.map((item) => item.slug), 'role slug');

	for (const link of content.profile.links) {
		validateLink(link, 'profile');
	}

	validateCv(content.site);
	validateReferences(content);
}

export async function loadContent(): Promise<PortfolioContent> {
	if (cached) return cached;

	const [
		profile,
		site,
		technologies,
		skills,
		roles,
		education,
		publications,
		projects,
		experience
	] =
		await Promise.all([
			readYaml<Profile>('profile.yaml'),
			readYaml<SiteConfig>('site.yaml'),
			readYamlCollection<Technology>('technologies'),
			readYamlCollection<Skill>('skills'),
			readYamlCollection<Role>('roles'),
			readYamlCollection<Education>('education'),
			readYamlCollection<Publication>('publications'),
			readYamlCollection<Project>('projects'),
			readYamlCollection<Experience>('experience')
		]);

	const content: PortfolioContent = {
		profile,
		site,
		technologies,
		skills,
		roles,
		projects,
		experience,
		education,
		publications
	};

	validateCore(content);
	cached = content;
	return content;
}
