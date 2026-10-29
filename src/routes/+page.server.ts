import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';
import { sortProjects } from '$lib/content/project-discovery';

export async function load() {
	const content = await loadContent();
	const featuredProjects = sortProjects(content.projects, 'score').slice(0, 6);
	const sortedExperience = [...content.experience].sort((a, b) =>
		getDateSortKey(b).localeCompare(getDateSortKey(a))
	);
	return {
		title: 'Portfolio',
		profile: content.profile,
		technologies: content.technologies,
		skills: content.skills,
		roles: content.roles,
		featuredProjects,
		experience: sortedExperience.slice(0, 2),
		graph: content.graph,
		cvUrl: content.site.cvUrl
	};
}
