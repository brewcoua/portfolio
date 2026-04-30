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

export type DateValue = string | [string] | [string, string];

export type DateRangeOrSingleDate = {
	date: DateValue;
};

export type Entity = {
	id: string;
	relationships: Relationship[];
};

export type SlugEntity = Entity & {
	slug: string;
};

export type LinkType =
	| 'github'
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
	};
	cv: {
		cvPdfUrl?: string;
		label?: string;
		lastVerified?: string;
	};
	navigation: Array<{ label: string; href: string }>;
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

export type Project = SlugEntity &
	DateRangeOrSingleDate & {
	title: string;
	subtitle?: string;
	abstract: string;
	abstractMarkdown?: MarkdownDoc;
	status: ProjectStatus;
	role: string;
	duration: string;
	featured: boolean;
	summary: string;
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
};

export type Education = SlugEntity &
	DateRangeOrSingleDate & {
	institution: string;
	degree: string;
	location: string;
	focus: string[];
	thesisTitle?: string;
	highlights: string[];
	highlightsMarkdown?: MarkdownInlineNode[][];
	subEducation?: Array<
		DateRangeOrSingleDate & {
			institution: string;
			degree: string;
			location: string;
			highlights: string[];
			highlightsMarkdown?: MarkdownInlineNode[][];
		}
	>;
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
};
