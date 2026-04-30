import type { PortfolioContent, Project, ProjectStatus, Role, Skill, Technology } from '$lib/content/types';

export type ProjectFilters = {
	query: string;
	technology: string;
	status: ProjectStatus | 'all';
	role: string;
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

function lookupLabels(ids: string[], map: Map<string, string>): string[] {
	return ids.map((id) => map.get(id) ?? id);
}

export function buildProjectSearchText(project: Project, roleLabel: string, technologyLabels: string[], skillLabels: string[]): string {
	const content = [
		project.title,
		project.subtitle ?? '',
		project.abstract,
		project.summary,
		project.description,
		project.highlights.join(' '),
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

		return matchesQuery && matchesTechnology && matchesStatus && matchesRole;
	});
}

export function getProjectFilterOptions(content: PortfolioContent) {
	return {
		technologies: content.technologies,
		roles: content.roles,
		statuses: ['completed', 'active', 'paused', 'archived'] as const
	};
}
