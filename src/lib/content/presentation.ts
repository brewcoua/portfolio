import type { LinkItem, ProjectStatus, Role, Skill, Technology } from '$lib/content/types';

export function getTechnologyById(id: string, technologies: Technology[]): Technology | undefined {
	return technologies.find((technology) => technology.id === id);
}

export function getSkillById(id: string, skills: Skill[]): Skill | undefined {
	return skills.find((skill) => skill.id === id);
}

export function getRoleById(id: string, roles: Role[]): Role | undefined {
	return roles.find((role) => role.id === id);
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
	completed: 'Completed',
	active: 'Active',
	paused: 'Paused',
	archived: 'Archived'
};

export function getProjectStatusLabel(status: ProjectStatus): string {
	return PROJECT_STATUS_LABELS[status] ?? status;
}

export type ResolvedLink = LinkItem & {
	label: string;
	icon: string;
	external: boolean;
};

const LINK_LABELS: Record<string, string> = {
	github: 'GitHub',
	demo: 'Demo',
	docs: 'Docs',
	paper: 'Paper',
	article: 'Article',
	video: 'Video',
	package: 'Package',
	live: 'Live',
	design: 'Design',
	linkedin: 'LinkedIn',
	email: 'Email'
};

const LINK_ICONS: Record<string, string> = {
	github: 'github',
	demo: 'external-link',
	docs: 'book-open',
	paper: 'file-text',
	article: 'newspaper',
	video: 'video',
	package: 'package',
	live: 'radio',
	design: 'palette',
	linkedin: 'linkedin',
	email: 'mail'
};

export function resolveLink(link: LinkItem): ResolvedLink {
	const defaultLabel = LINK_LABELS[link.type] ?? link.type;
	const defaultIcon = LINK_ICONS[link.type] ?? 'link';

	return {
		...link,
		label: link.label ?? defaultLabel,
		icon: link.icon ?? defaultIcon,
		external: link.type !== 'email'
	};
}
