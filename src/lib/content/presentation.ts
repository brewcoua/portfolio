import type { LinkItem, Skill, Technology } from '$lib/content/types';

export function getTechnologyById(id: string, technologies: Technology[]): Technology | undefined {
	return technologies.find((technology) => technology.id === id);
}

export function getTechnologyChipStyle(id: string, technologies: Technology[]): string {
	const color = getTechnologyById(id, technologies)?.color;
	if (!color) return 'background-color: color-mix(in oklab, var(--muted) 70%, transparent); border-color: var(--border);';

	return [
		`--tech-color: ${color}`,
		'background-color: color-mix(in oklab, var(--tech-color) 15%, transparent)',
		'border-color: color-mix(in oklab, var(--tech-color) 60%, var(--border))',
		'color: color-mix(in oklab, var(--tech-color) 75%, white)'
	].join('; ');
}

export function getSkillById(id: string, skills: Skill[]): Skill | undefined {
	return skills.find((skill) => skill.id === id);
}

export function getSkillChipStyle(id: string, skills: Skill[]): string {
	const color = getSkillById(id, skills)?.color;
	if (!color) return 'background-color: color-mix(in oklab, var(--muted) 70%, transparent); border-color: var(--border);';

	return [
		`--skill-color: ${color}`,
		'background-color: color-mix(in oklab, var(--skill-color) 14%, transparent)',
		'border-color: color-mix(in oklab, var(--skill-color) 55%, var(--border))',
		'color: color-mix(in oklab, var(--skill-color) 70%, white)'
	].join('; ');
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
