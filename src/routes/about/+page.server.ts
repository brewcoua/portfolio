import { loadContent } from '$lib/server/content';

export async function load() {
	const { profile, technologies } = await loadContent();
	return { profile, technologies };
}
