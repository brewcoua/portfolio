import { PROJECT_KIND_LABELS } from '$lib/content/types';
import type {
	MarkdownBlockNode,
	MarkdownDoc,
	MarkdownInlineNode,
	PortfolioContent,
	Project,
	ProjectKind,
	ProjectStatus,
	Role,
	Skill,
	Technology
} from '$lib/content/types';

export type ProjectFilters = {
	query: string;
	technology: string;
	status: ProjectStatus | 'all';
	role: string;
	kind: ProjectKind | 'all';
};

export type ResolvedProject = Project & {
	technologyLabels: string[];
	skillLabels: string[];
	roleLabel: string;
	searchText: string;
};

function normalize(value: string): string {
	return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function inlineToText(nodes: MarkdownInlineNode[]): string {
	return nodes
		.map((node) => {
			if (node.type === 'text' || node.type === 'inlineCode') return node.value;
			if (node.type === 'mention') return node.label;
			if (node.type === 'strong' || node.type === 'emphasis' || node.type === 'link') {
				return inlineToText(node.children);
			}
			return '';
		})
		.join(' ');
}

function blockToText(node: MarkdownBlockNode): string {
	if (node.type === 'paragraph' || node.type === 'heading') return inlineToText(node.children);
	if (node.type === 'blockquote') return node.children.map((child) => blockToText(child)).join(' ');
	if (node.type === 'list') return node.items.flatMap((item) => item.map((block) => blockToText(block))).join(' ');
	if (node.type === 'code') return node.value;
	return '';
}

function markdownToPlainText(doc: MarkdownDoc | undefined): string {
	if (!doc) return '';
	return doc.blocks
		.map((block) => blockToText(block))
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function lookupLabels(ids: string[], map: Map<string, string>): string[] {
	return ids.map((id) => map.get(id) ?? id);
}

export function buildProjectSearchText(project: Project, roleLabel: string, technologyLabels: string[], skillLabels: string[]): string {
	const content = [
		project.title,
		project.subtitle ?? '',
		markdownToPlainText(project.abstractMarkdown),
		markdownToPlainText(project.summaryMarkdown),
		markdownToPlainText(project.descriptionMarkdown),
		(project.highlightsMarkdown ?? []).map((highlight) => inlineToText(highlight)).join(' '),
		project.searchKeywords?.join(' ') ?? '',
		roleLabel,
		technologyLabels.join(' '),
		skillLabels.join(' ')
	].join(' ');
	return normalize(content);
}

export function resolveProjectsForDiscovery(
	projects: Project[],
	technologies: Technology[],
	skills: Skill[],
	roles: Role[]
): ResolvedProject[] {
	const technologyMap = new Map(technologies.map((item) => [item.id, item.label]));
	const skillMap = new Map(skills.map((item) => [item.id, item.label]));
	const roleMap = new Map(roles.map((item) => [item.id, item.label]));

	return projects.map((project) => {
		const technologyLabels = lookupLabels(project.technologies, technologyMap);
		const skillLabels = lookupLabels(project.skills, skillMap);
		const roleLabel = roleMap.get(project.role) ?? project.role;

		return {
			...project,
			technologyLabels,
			skillLabels,
			roleLabel,
			searchText: buildProjectSearchText(project, roleLabel, technologyLabels, skillLabels)
		};
	});
}

export function filterProjects(projects: ResolvedProject[], filters: ProjectFilters): ResolvedProject[] {
	const normalizedQuery = normalize(filters.query);

	return projects.filter((project) => {
		const matchesQuery = normalizedQuery.length === 0 || project.searchText.includes(normalizedQuery);
		const matchesTechnology =
			filters.technology === 'all' || project.technologies.includes(filters.technology);
		const matchesStatus = filters.status === 'all' || project.status === filters.status;
		const matchesRole = filters.role === 'all' || project.role === filters.role;
		const matchesKind = filters.kind === 'all' || project.kind === filters.kind;

		return matchesQuery && matchesTechnology && matchesStatus && matchesRole && matchesKind;
	});
}

export function getProjectFilterOptions(content: PortfolioContent) {
	// Only offer kinds that at least one project actually uses, in canonical order.
	const usedKinds = new Set(content.projects.map((project) => project.kind).filter(Boolean));
	const kinds = (Object.keys(PROJECT_KIND_LABELS) as ProjectKind[]).filter((kind) =>
		usedKinds.has(kind)
	);

	return {
		technologies: content.technologies,
		roles: content.roles,
		statuses: ['completed', 'active', 'paused', 'archived'] as const,
		kinds
	};
}
