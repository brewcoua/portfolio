import { error } from '@sveltejs/kit';
import { getRelated } from '$lib/content/relationships';
import { loadContent } from '$lib/server/content';

export async function entries() {
	const { publications } = await loadContent();
	return publications.map((publication) => ({ slug: publication.slug }));
}

export async function load({ params }) {
	const content = await loadContent();
	const publication = content.publications.find((item) => item.slug === params.slug);
	if (!publication) throw error(404, 'Publication not found');

	const relatedProjects = getRelated(publication.relationships, content.projects, 'project');

	return {
		publication,
		relatedProjects,
		technologies: content.technologies,
		skills: content.skills
	};
}
