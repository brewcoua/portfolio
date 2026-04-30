import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';

export async function load() {
	const content = await loadContent();
	const featuredProjects = content.projects.filter((project) => project.featured);
	const sortedExperience = [...content.experience].sort((a, b) =>
		getDateSortKey(b).localeCompare(getDateSortKey(a))
	);
	return {
		profile: content.profile,
		technologies: content.technologies,
		skills: content.skills,
		roles: content.roles,
		featuredProjects,
		experience: sortedExperience.slice(0, 2)
	};
}
