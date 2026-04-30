import { loadContent } from '$lib/server/content';

export async function load() {
	const { site, profile } = await loadContent();
	return { site, profile };
}
