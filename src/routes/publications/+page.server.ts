import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';

export async function load() {
	const content = await loadContent();

	return {
		title: 'Publications',
		publications: [...content.publications].sort((a, b) =>
			getDateSortKey(b).localeCompare(getDateSortKey(a))
		),
		technologies: content.technologies,
		skills: content.skills
	};
}
