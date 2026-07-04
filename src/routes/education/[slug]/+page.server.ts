import { error } from '@sveltejs/kit';
import { getRelated } from '$lib/content/relationships';
import { loadContent } from '$lib/server/content';

export async function entries() {
	const { education } = await loadContent();
	return education.map((item) => ({ slug: item.slug }));
}

export async function load({ params }) {
	const content = await loadContent();
	const education = content.education.find((item) => item.slug === params.slug);
	if (!education) throw error(404, 'Education not found');

	const linkedProjects = getRelated(education.relationships, content.projects, 'project');
	const linkedExperience = getRelated(education.relationships, content.experience, 'experience');

	return {
		education,
		linkedProjects,
		linkedExperience,
		technologies: content.technologies,
		skills: content.skills
	};
}
