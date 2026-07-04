import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';

export async function load() {
	const content = await loadContent();

	return {
		publications: [...content.publications].sort((a, b) =>
			getDateSortKey(b).localeCompare(getDateSortKey(a))
		),
		technologies: content.technologies,
		skills: content.skills
	};
}
