import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';
import { getProjectFilterOptions, resolveProjectsForDiscovery } from '$lib/content/project-discovery';

export async function load() {
	const content = await loadContent();
	const resolvedProjects = resolveProjectsForDiscovery(
		content.projects,
		content.technologies,
		content.skills,
		content.roles
	);
	const filterOptions = getProjectFilterOptions(content);

	return {
		projects: [...resolvedProjects].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a))),
		technologies: content.technologies,
		skills: content.skills,
		roles: content.roles,
		filterOptions
	};
}
