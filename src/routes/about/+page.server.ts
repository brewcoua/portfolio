import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';

export async function load() {
	const { profile, experience, education, skills, technologies } = await loadContent();
	return {
		profile,
		skills,
		technologies,
		experience: [...experience].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a))),
		education: [...education].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a)))
	};
}
