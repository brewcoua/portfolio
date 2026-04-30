import { loadContent } from '$lib/server/content';

export async function load() {
	const { profile } = await loadContent();
	return { links: profile.links, name: profile.name };
}
