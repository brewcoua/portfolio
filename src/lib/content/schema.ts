import { z } from 'zod';

/**
 * Centralized content schema. Every content node is a markdown file whose
 * frontmatter is validated here. Identity is path-based (folder = type,
 * filename = slug); cross-references are `[[wikilinks]]` resolved by the loader.
 * This module is the single source of truth for the authored shape — it
 * replaces the former hand-written types + imperative validators.
 */

export const NODE_TYPES = [
	'project',
	'experience',
	'education',
	'publication',
	'technology',
	'skill',
	'role'
] as const;
export type NodeType = (typeof NODE_TYPES)[number];

/** Directory name (plural) -> node type (singular). */
export const COLLECTION_TYPES = {
	projects: 'project',
	experience: 'experience',
	education: 'education',
	publications: 'publication',
	technologies: 'technology',
	skills: 'skill',
	roles: 'role'
} as const satisfies Record<string, NodeType>;

export type CollectionDir = keyof typeof COLLECTION_TYPES;

// --- Shared primitives -------------------------------------------------------

const isoDate = z
	.string()
	.regex(/^\d{4}-\d{2}(-\d{2})?$/, 'date must be YYYY-MM or YYYY-MM-DD');

/** End of an ongoing range: `["2025-09", "present"]`. Distinguishes ongoing from a one-off point. */
const isoDateOrPresent = z.union([isoDate, z.literal('present')]);

export const dateValue = z.union([
	isoDate,
	z.tuple([isoDate]),
	z.tuple([isoDate, isoDateOrPresent])
]);

export const hexColor = z
	.string()
	.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'expected a #RGB or #RRGGBB hex color');

/** A `[[type/slug]]` or `[[type/slug|display text]]` reference (existence checked by loader). */
export const wikilink = z
	.string()
	.regex(/^\[\[[^\]]+\]\]$/, 'expected a [[wikilink]]');

export const LINK_TYPES = [
	'github',
	'codeberg',
	'gitlab',
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
] as const;

export const linkItem = z
	.object({
		type: z.enum(LINK_TYPES),
		url: z.string().min(1),
		label: z.string().min(1).optional(),
		icon: z.string().min(1).optional()
	})
	.superRefine((link, ctx) => {
		if (link.type === 'email') {
			if (!link.url.startsWith('mailto:')) {
				ctx.addIssue({ code: 'custom', message: 'email link url must start with mailto:' });
			}
			return;
		}
		let host: string | null = null;
		try {
			const url = new URL(link.url);
			if (url.protocol !== 'https:') {
				ctx.addIssue({ code: 'custom', message: `link url must be https: ${link.url}` });
			}
			host = url.host;
		} catch {
			ctx.addIssue({ code: 'custom', message: `invalid link url: ${link.url}` });
		}
		const hostRules: Partial<Record<(typeof LINK_TYPES)[number], string>> = {
			github: 'github.com',
			codeberg: 'codeberg.org',
			gitlab: 'gitlab.com',
			linkedin: 'linkedin.com'
		};
		const requiredHost = hostRules[link.type];
		if (requiredHost && host && !host.includes(requiredHost)) {
			ctx.addIssue({ code: 'custom', message: `${link.type} link must point to ${requiredHost}` });
		}
		if (link.type === 'custom' && (!link.label || !link.icon)) {
			ctx.addIssue({ code: 'custom', message: 'custom links require a label and icon' });
		}
	});

export type LinkItem = z.infer<typeof linkItem>;

export const projectReference = z.object({
	title: z.string().min(1),
	authors: z.array(z.string().min(1)).min(1),
	year: z.string().regex(/^\d{4}$/),
	journal: z.string().optional(),
	venue: z.string().optional(),
	doi: z.string().min(1).optional(),
	url: z.string().url().optional()
});

/** Grade is normalized/validated by the loader (honors enum + fraction format). */
const gradeInput = z.record(z.string(), z.unknown());

// --- Per-type frontmatter schemas -------------------------------------------

const links = z.array(linkItem).optional();

export const projectFrontmatter = z.object({
	title: z.string().min(1),
	subtitle: z.string().optional(),
	abstract: z.string().min(1),
	status: z.enum(['completed', 'active', 'paused', 'archived']),
	kind: z.enum(['hackathon', 'personal', 'professional', 'coursework', 'research']).optional(),
	featured: z.boolean().default(false),
	date: dateValue,
	duration: z.string().optional(),
	thumbnail: z.string().min(1).optional(),
	role: wikilink,
	tech: z.array(wikilink).default([]),
	skills: z.array(wikilink).default([]),
	related: z.array(wikilink).default([]),
	links: z.array(linkItem).default([]),
	references: z.array(projectReference).optional(),
	highlights: z.array(z.string().min(1)).default([]),
	searchKeywords: z.array(z.string()).optional()
});

export const experienceFrontmatter = z.object({
	title: z.string().min(1),
	organization: z.string().min(1),
	website: z.string().url().optional(),
	logo: z.string().min(1).optional(),
	location: z.string().min(1),
	employmentType: z.string().min(1),
	date: dateValue,
	summary: z.string().min(1),
	tech: z.array(wikilink).default([]),
	related: z.array(wikilink).default([]),
	details: z.array(z.string().min(1)).default([])
});

const educationSubEntry = z.object({
	institution: z.string().min(1),
	degree: z.string().min(1),
	date: dateValue,
	location: z.string().min(1),
	website: z.string().url().optional(),
	logo: z.string().min(1).optional(),
	track: z.array(z.string()).optional(),
	grade: gradeInput.optional(),
	highlights: z.array(z.string()).default([]),
	activities: z.array(z.string()).default([]),
	societies: z.array(z.string()).default([])
});

export const educationFrontmatter = z.object({
	institution: z.string().min(1),
	degree: z.string().min(1),
	date: dateValue,
	location: z.string().min(1),
	website: z.string().url().optional(),
	logo: z.string().min(1).optional(),
	track: z.array(z.string()).optional(),
	focus: z.array(z.string()).default([]),
	thesisTitle: z.string().optional(),
	grade: gradeInput.optional(),
	highlights: z.array(z.string()).default([]),
	activities: z.array(z.string()).default([]),
	societies: z.array(z.string()).default([]),
	subEducation: z.array(educationSubEntry).optional(),
	related: z.array(wikilink).default([]),
	tech: z.array(wikilink).default([]),
	skills: z.array(wikilink).default([])
});

export const technologyFrontmatter = z.object({
	label: z.string().min(1),
	category: z.string().min(1),
	icon: z.string().min(1).optional(),
	color: hexColor.optional(),
	skills: z.array(wikilink).default([]),
	links: links.default([])
});

export const skillFrontmatter = z.object({
	label: z.string().min(1),
	category: z.string().min(1),
	color: hexColor.optional(),
	tech: z.array(wikilink).default([]),
	links: links.default([])
});

export const roleFrontmatter = z.object({
	label: z.string().min(1),
	icon: z.string().min(1).optional(),
	color: hexColor.optional()
});

export const publicationFrontmatter = z.object({
	title: z.string().min(1),
	subtitle: z.string().optional(),
	authors: z.array(z.string().min(1)).min(1),
	abstract: z.string().min(1),
	venue: z.string().optional(),
	kind: z.enum(['coursework', 'research', 'preprint', 'thesis', 'report']).optional(),
	featured: z.boolean().default(false),
	date: dateValue,
	doi: z.string().min(1).optional(),
	links: z.array(linkItem).default([]),
	tech: z.array(wikilink).default([]),
	skills: z.array(wikilink).default([]),
	related: z.array(wikilink).default([]),
	references: z.array(projectReference).optional(),
	highlights: z.array(z.string().min(1)).default([]),
	searchKeywords: z.array(z.string()).optional()
});

export const profileFrontmatter = z.object({
	name: z.string().min(1),
	headline: z.string().min(1),
	location: z.string().min(1),
	roles: z.array(z.string()).default([]),
	skillsHighlight: z.array(wikilink).default([]),
	links: z.array(linkItem).default([])
});

export const siteConfig = z.object({
	siteName: z.string().min(1),
	baseUrl: z.string().url(),
	defaultSeo: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		image: z.string().min(1),
		keywords: z.array(z.string()).default([])
	}),
	cvUrl: z.string().url().optional(),
	navigation: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
});

export const FRONTMATTER_SCHEMAS = {
	projects: projectFrontmatter,
	experience: experienceFrontmatter,
	education: educationFrontmatter,
	technologies: technologyFrontmatter,
	skills: skillFrontmatter,
	roles: roleFrontmatter,
	publications: publicationFrontmatter
} as const satisfies Record<CollectionDir, z.ZodTypeAny>;

export type ProjectFrontmatter = z.infer<typeof projectFrontmatter>;
export type ExperienceFrontmatter = z.infer<typeof experienceFrontmatter>;
export type EducationFrontmatter = z.infer<typeof educationFrontmatter>;
export type TechnologyFrontmatter = z.infer<typeof technologyFrontmatter>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatter>;
export type RoleFrontmatter = z.infer<typeof roleFrontmatter>;
export type PublicationFrontmatter = z.infer<typeof publicationFrontmatter>;
export type ProfileFrontmatter = z.infer<typeof profileFrontmatter>;
export type SiteConfigInput = z.infer<typeof siteConfig>;

/** Parse a `[[type/slug]]` / `[[type/slug|display]]` reference into its parts. */
export function parseWikilink(raw: string): { target: string; alias?: string } | null {
	const match = raw.match(/^\[\[([^\]]+)\]\]$/);
	if (!match) return null;
	const inner = match[1];
	const pipe = inner.indexOf('|');
	if (pipe === -1) return { target: inner.trim() };
	return { target: inner.slice(0, pipe).trim(), alias: inner.slice(pipe + 1).trim() };
}
