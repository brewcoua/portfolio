import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';

export async function load() {
	const { experience } = await loadContent();
	return { experience: [...experience].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a))) };
}
