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

export type Profile = {
	id: string;
	name: string;
	headline: string;
	location: string;
	summary: string;
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
	links: LinkItem[];
};

export type Skill = SlugEntity & {
	label: string;
	category: string;
	description?: string;
	color?: string;
	links: LinkItem[];
};

export type Role = SlugEntity & {
	label: string;
	description?: string;
};

export type ProjectStatus = 'completed' | 'active' | 'paused' | 'archived';

export type Project = SlugEntity &
	DateRangeOrSingleDate & {
	title: string;
	subtitle?: string;
	abstract: string;
	status: ProjectStatus;
	role: string;
	duration: string;
	featured: boolean;
	summary: string;
	description: string;
	thumbnail?: string;
	technologies: string[];
	skills: string[];
	links: LinkItem[];
	highlights: string[];
	searchKeywords?: string[];
};

export type Experience = SlugEntity &
	DateRangeOrSingleDate & {
	title: string;
	organization: string;
	location: string;
	employmentType: string;
	summary: string;
	details: string[];
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
