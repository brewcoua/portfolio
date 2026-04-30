import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';

export async function load() {
	const { education } = await loadContent();
	return { education: [...education].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a))) };
}
