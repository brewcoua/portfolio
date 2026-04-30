import { error } from '@sveltejs/kit';
import { getRelated } from '$lib/content/relationships';
import { loadContent } from '$lib/server/content';

export async function entries() {
	const { experience } = await loadContent();
	return experience.map((item) => ({ slug: item.slug }));
}

export async function load({ params }) {
	const content = await loadContent();
	const experience = content.experience.find((item) => item.slug === params.slug);
	if (!experience) throw error(404, 'Experience not found');

	const linkedProjects = getRelated(experience.relationships, content.projects, 'project');

	return {
		experience,
		linkedProjects,
		technologies: content.technologies,
		skills: content.skills
	};
}
