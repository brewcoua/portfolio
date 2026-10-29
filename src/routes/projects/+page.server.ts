import { loadContent } from '$lib/server/content';
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
		title: 'Projects',
		projects: resolvedProjects,
		technologies: content.technologies,
		skills: content.skills,
		roles: content.roles,
		filterOptions
	};
}
