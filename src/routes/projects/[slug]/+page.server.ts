import { error } from '@sveltejs/kit';
import { getRelated } from '$lib/content/relationships';
import { loadContent } from '$lib/server/content';

export async function entries() {
	const { projects } = await loadContent();
	return projects.map((project) => ({ slug: project.slug }));
}

export async function load({ params }) {
	const content = await loadContent();
	const project = content.projects.find((item) => item.slug === params.slug);
	if (!project) throw error(404, 'Project not found');

	const relatedExperience = getRelated(project.relationships, content.experience, 'experience');

	return {
		project,
		relatedExperience,
		technologies: content.technologies,
		skills: content.skills,
		roles: content.roles
	};
}
