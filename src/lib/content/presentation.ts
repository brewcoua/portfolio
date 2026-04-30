import type { LinkItem, ProjectStatus, Role, Skill, Technology } from '$lib/content/types';

export function getTechnologyById(id: string, technologies: Technology[]): Technology | undefined {
	return technologies.find((technology) => technology.id === id);
}

type Rgb = { r: number; g: number; b: number };

const WCAG_AA_NORMAL_TEXT = 4.5;
const LIGHT_SURFACE: Rgb = { r: 255, g: 255, b: 255 };
const DARK_SURFACE: Rgb = { r: 13, g: 17, b: 23 };
const LIGHT_FOREGROUND: Rgb = { r: 17, g: 24, b: 39 };
const DARK_FOREGROUND: Rgb = { r: 241, g: 245, b: 249 };
const FALLBACK_CHIP_STYLE =
	'background-color: color-mix(in oklab, var(--muted) 70%, transparent); border-color: var(--border); color: var(--foreground);';

function clampChannel(value: number): number {
	return Math.min(255, Math.max(0, Math.round(value)));
}

function toHex(rgb: Rgb): string {
	return `#${[rgb.r, rgb.g, rgb.b].map((value) => clampChannel(value).toString(16).padStart(2, '0')).join('')}`;
}

export function parseHexColor(input: string): Rgb | null {
	const value = input.trim();
	const short = /^#([0-9a-fA-F]{3})$/;
	const full = /^#([0-9a-fA-F]{6})$/;

	if (short.test(value)) {
		const [, compact] = value.match(short) ?? [];
		if (!compact) return null;
		return {
			r: parseInt(`${compact[0]}${compact[0]}`, 16),
			g: parseInt(`${compact[1]}${compact[1]}`, 16),
			b: parseInt(`${compact[2]}${compact[2]}`, 16)
		};
	}

	if (full.test(value)) {
		const [, hex] = value.match(full) ?? [];
		if (!hex) return null;
		return {
			r: parseInt(hex.slice(0, 2), 16),
			g: parseInt(hex.slice(2, 4), 16),
			b: parseInt(hex.slice(4, 6), 16)
		};
	}

	return null;
}

function blend(foreground: Rgb, background: Rgb, alpha: number): Rgb {
	const weight = Math.min(1, Math.max(0, alpha));
	return {
		r: clampChannel(foreground.r * weight + background.r * (1 - weight)),
		g: clampChannel(foreground.g * weight + background.g * (1 - weight)),
		b: clampChannel(foreground.b * weight + background.b * (1 - weight))
	};
}

function relativeLuminance(color: Rgb): number {
	const linear = [color.r, color.g, color.b].map((channel) => {
		const normalized = channel / 255;
		return normalized <= 0.03928
			? normalized / 12.92
			: ((normalized + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(a: Rgb, b: Rgb): number {
	const first = relativeLuminance(a);
	const second = relativeLuminance(b);
	const lighter = Math.max(first, second);
	const darker = Math.min(first, second);
	return (lighter + 0.05) / (darker + 0.05);
}

export function pickReadableForeground(
	background: Rgb,
	candidates: Rgb[],
	minContrast = WCAG_AA_NORMAL_TEXT
): Rgb {
	const sorted = candidates
		.map((candidate) => ({ candidate, score: contrastRatio(background, candidate) }))
		.sort((left, right) => right.score - left.score);

	const passing = sorted.find((entry) => entry.score >= minContrast);
	return (passing ?? sorted[0]).candidate;
}

function getEntityChipStyle(color: string | undefined, kind: 'technology' | 'skill' | 'status' | 'role'): string {
	if (!color) return FALLBACK_CHIP_STYLE;

	const parsed = parseHexColor(color);
	if (!parsed) return FALLBACK_CHIP_STYLE;

	const tintStrength = kind === 'technology' ? 0.16 : kind === 'status' ? 0.17 : 0.15;
	const borderStrength = kind === 'technology' ? 0.52 : kind === 'status' ? 0.5 : 0.48;
	const tintedLightBackground = blend(parsed, LIGHT_SURFACE, tintStrength);
	const tintedDarkBackground = blend(parsed, DARK_SURFACE, tintStrength + 0.08);
	const borderLight = blend(parsed, LIGHT_SURFACE, borderStrength);
	const borderDark = blend(parsed, DARK_SURFACE, borderStrength + 0.06);

	const lightCandidates = [blend(parsed, { r: 0, g: 0, b: 0 }, 0.72), LIGHT_FOREGROUND, { r: 0, g: 0, b: 0 }];
	const darkCandidates = [
		blend(parsed, { r: 255, g: 255, b: 255 }, 0.8),
		DARK_FOREGROUND,
		{ r: 255, g: 255, b: 255 }
	];

	const lightText = pickReadableForeground(tintedLightBackground, lightCandidates);
	const darkText = pickReadableForeground(tintedDarkBackground, darkCandidates);

	return [
		`--chip-bg-light: ${toHex(tintedLightBackground)}`,
		`--chip-bg-dark: ${toHex(tintedDarkBackground)}`,
		`--chip-border-light: ${toHex(borderLight)}`,
		`--chip-border-dark: ${toHex(borderDark)}`,
		`--chip-text-light: ${toHex(lightText)}`,
		`--chip-text-dark: ${toHex(darkText)}`,
		'background-color: light-dark(var(--chip-bg-light), var(--chip-bg-dark))',
		'border-color: light-dark(var(--chip-border-light), var(--chip-border-dark))',
		'color: light-dark(var(--chip-text-light), var(--chip-text-dark))'
	].join('; ');
}

export function getTechnologyChipStyle(id: string, technologies: Technology[]): string {
	const color = getTechnologyById(id, technologies)?.color;
	return getEntityChipStyle(color, 'technology');
}

export function getSkillById(id: string, skills: Skill[]): Skill | undefined {
	return skills.find((skill) => skill.id === id);
}

export function getSkillChipStyle(id: string, skills: Skill[]): string {
	const color = getSkillById(id, skills)?.color;
	return getEntityChipStyle(color, 'skill');
}

export function getRoleById(id: string, roles: Role[]): Role | undefined {
	return roles.find((role) => role.id === id);
}

export function getRoleChipStyle(id: string, roles: Role[]): string {
	const color = getRoleById(id, roles)?.color;
	return getEntityChipStyle(color, 'role');
}

/** Brand hues for status badges — contrast is finalized in `getProjectStatusBadgeStyle`. */
export const PROJECT_STATUS_BRAND_HEX: Record<ProjectStatus, string> = {
	completed: '#16a34a',
	active: '#2563eb',
	paused: '#d97706',
	archived: '#64748b'
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
	completed: 'Completed',
	active: 'Active',
	paused: 'Paused',
	archived: 'Archived'
};

export function getProjectStatusLabel(status: ProjectStatus): string {
	return PROJECT_STATUS_LABELS[status] ?? status;
}

export function getProjectStatusBadgeStyle(status: ProjectStatus): string {
	return getEntityChipStyle(PROJECT_STATUS_BRAND_HEX[status], 'status');
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
