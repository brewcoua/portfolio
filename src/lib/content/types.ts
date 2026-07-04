import type { NodeType } from './schema';

export type { NodeType } from './schema';

export type RelationshipType =
	| 'project'
	| 'experience'
	| 'education'
	| 'publication'
	| 'technology'
	| 'skill'
	| 'role'
	| 'external';

export type Relationship = {
	type: RelationshipType;
	targetId: string;
	label?: string;
	role?: string;
};

/**
 * A date is either a single point (`"2026-06"` or `["2026-06"]`), a closed range
 * (`["2022-09", "2025-07"]`), or an ongoing range (`["2025-09", "present"]`). The
 * `'present'` sentinel is what distinguishes "ongoing" from a one-off point.
 */
export type DateValue = string | [string] | [string, string];

export type DateRangeOrSingleDate = {
	date: DateValue;
};

/**
 * Every content node is identified by its `path` (`type/slug`, derived from the
 * folder + filename). `id` is kept as an alias of `path` so all id-based lookups
 * keep working. `relationships` is derived by the loader from `[[wikilinks]]`.
 */
export type Entity = {
	id: string;
	path: string;
	type: NodeType;
	relationships: Relationship[];
};

export type SlugEntity = Entity & {
	slug: string;
};

export type LinkType =
	| 'github'
	| 'codeberg'
	| 'gitlab'
	| 'demo'
	| 'docs'
	| 'paper'
	| 'article'
	| 'video'
	| 'package'
	| 'live'
	| 'design'
	| 'linkedin'
	| 'email'
	| 'custom';

export type LinkItem = {
	type: LinkType;
	url: string;
	label?: string;
	icon?: string;
};

export type MarkdownMentionKind =
	| 'project'
	| 'experience'
	| 'education'
	| 'publication'
	| 'technology'
	| 'skill'
	| 'role';

export type MarkdownInlineNode =
	| { type: 'text'; value: string }
	| { type: 'strong'; children: MarkdownInlineNode[] }
	| { type: 'emphasis'; children: MarkdownInlineNode[] }
	| { type: 'inlineCode'; value: string }
	| { type: 'link'; href: string; children: MarkdownInlineNode[]; external: boolean }
	| {
			type: 'mention';
			mentionKind: MarkdownMentionKind;
			label: string;
			entityId?: string;
			href?: string;
			popoverTitle?: string;
			popoverBody?: string;
	  };

export type MarkdownBlockNode =
	| { type: 'paragraph'; children: MarkdownInlineNode[] }
	| { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: MarkdownInlineNode[] }
	| { type: 'blockquote'; children: MarkdownBlockNode[] }
	| { type: 'list'; ordered: boolean; items: MarkdownBlockNode[][] }
	| { type: 'code'; language?: string; value: string };

export type MarkdownDoc = {
	blocks: MarkdownBlockNode[];
};

export type ProjectReference = {
	title: string;
	authors: string[];
	year: string;
	journal?: string;
	venue?: string;
	doi?: string;
	url?: string;
};

export type MentionSourceKind = 'project' | 'experience' | 'education';

export type MentionSource = {
	key: string;
	kind: MentionSourceKind;
	label: string;
	href: string;
};

export type Profile = {
	id: string;
	name: string;
	headline: string;
	location: string;
	summary: string;
	summaryMarkdown?: MarkdownDoc;
	roles: string[];
	links: LinkItem[];
	skillsHighlight: string[];
};

export type SiteConfig = {
	siteName: string;
	baseUrl: string;
	defaultSeo: {
		title: string;
		description: string;
		image: string;
		keywords: string[];
	};
	cvUrl?: string;
	navigation: Array<{ label: string; href: string }>;
};

export type GraphNode = {
	id: string;
	type: NodeType | 'profile';
	label: string;
	url?: string;
	color?: string;
	/** Frontmatter icon name (Lucide), used for the per-role/technology glyph. */
	icon?: string;
	/** Relative visual weight used to size the node in the graph. */
	weight: number;
};

export type GraphLinkKind = 'role' | 'technology' | 'skill' | 'mention';

export type GraphLink = {
	source: string;
	target: string;
	kind: GraphLinkKind;
};

export type GraphData = {
	nodes: GraphNode[];
	links: GraphLink[];
};

export type Technology = SlugEntity & {
	label: string;
	category: string;
	icon?: string;
	color?: string;
	description?: string;
	descriptionMarkdown?: MarkdownInlineNode[];
	links: LinkItem[];
};

export type Skill = SlugEntity & {
	label: string;
	category: string;
	description?: string;
	descriptionMarkdown?: MarkdownInlineNode[];
	color?: string;
	links: LinkItem[];
};

export type Role = SlugEntity & {
	label: string;
	icon?: string;
	color?: string;
	description?: string;
	descriptionMarkdown?: MarkdownInlineNode[];
};

export type ProjectStatus = 'completed' | 'active' | 'paused' | 'archived';

/** Context in which a project was built (mirrors experience's employmentType). */
export type ProjectKind = 'hackathon' | 'personal' | 'professional' | 'coursework' | 'research';

export const PROJECT_KIND_LABELS: Record<ProjectKind, string> = {
	hackathon: 'Hackathon',
	personal: 'Personal',
	professional: 'Professional',
	coursework: 'Coursework',
	research: 'Research'
};

export type Project = SlugEntity &
	DateRangeOrSingleDate & {
	title: string;
	subtitle?: string;
	abstract: string;
	abstractMarkdown?: MarkdownDoc;
	status: ProjectStatus;
	kind?: ProjectKind;
	role: string;
	duration?: string;
	featured: boolean;
	summary?: string;
	summaryMarkdown?: MarkdownDoc;
	description: string;
	descriptionMarkdown?: MarkdownDoc;
	thumbnail?: string;
	technologies: string[];
	skills: string[];
	links: LinkItem[];
	references?: ProjectReference[];
	highlights: string[];
	highlightsMarkdown?: MarkdownInlineNode[][];
	searchKeywords?: string[];
};

export type Experience = SlugEntity &
	DateRangeOrSingleDate & {
	title: string;
	organization: string;
	location: string;
	employmentType: string;
	summary: string;
	summaryMarkdown?: MarkdownDoc;
	details: string[];
	detailsMarkdown?: MarkdownInlineNode[][];
	technologies: string[];
	logo?: string;
	website?: string;
};

/** YAML: `grade: { fraction: "14/20" }` — numeric / numeric (decimals allowed). */
export type EducationGradeFraction = { kind: 'fraction'; value: string };

/** YAML: `grade: { honors: high-honors }` — see `EDUCATION_HONORS_GRADES`. */
export type EducationGradeHonors = { kind: 'honors'; honors: EducationHonorsGrade };

/** YAML: `grade: { label: "Mention très bien" }` — freeform when not covered by enums. */
export type EducationGradeLabel = { kind: 'label'; label: string };

export type EducationGrade = EducationGradeFraction | EducationGradeHonors | EducationGradeLabel;

/** Allowed `grade.honors` keys in YAML (`high-honors`, `summa-cum-laude`, …). */
export const EDUCATION_HONORS_GRADES = [
	'honors',
	'high-honors',
	'highest-honors',
	'cum-laude',
	'magna-cum-laude',
	'summa-cum-laude',
	'distinction',
	'merit',
	'first-class',
	'upper-second-class',
	'lower-second-class',
	'third-class'
] as const;

export type EducationHonorsGrade = (typeof EDUCATION_HONORS_GRADES)[number];

export type EducationSubEntry = DateRangeOrSingleDate & {
	institution: string;
	degree: string;
	location: string;
	track?: string[];
	grade?: EducationGrade;
	highlights: string[];
	highlightsMarkdown?: MarkdownInlineNode[][];
	activities: string[];
	activitiesMarkdown?: MarkdownInlineNode[][];
	societies: string[];
	societiesMarkdown?: MarkdownInlineNode[][];
	logo?: string;
	website?: string;
};

export type Education = SlugEntity &
	DateRangeOrSingleDate & {
	institution: string;
	degree: string;
	location: string;
	track?: string[];
	focus: string[];
	thesisTitle?: string;
	grade?: EducationGrade;
	highlights: string[];
	highlightsMarkdown?: MarkdownInlineNode[][];
	activities: string[];
	activitiesMarkdown?: MarkdownInlineNode[][];
	societies: string[];
	societiesMarkdown?: MarkdownInlineNode[][];
	subEducation?: EducationSubEntry[];
	logo?: string;
	website?: string;
};

export type Publication = SlugEntity & {
	title: string;
	venue?: string;
	year?: number;
	url?: string;
};

export type PortfolioContent = {
	profile: Profile;
	site: SiteConfig;
	technologies: Technology[];
	skills: Skill[];
	roles: Role[];
	projects: Project[];
	experience: Experience[];
	education: Education[];
	publications: Publication[];
	graph: GraphData;
};
