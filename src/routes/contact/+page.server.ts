import { loadContent } from '$lib/server/content';

export async function load() {
	const { profile } = await loadContent();
	return { title: 'Contact', links: profile.links, name: profile.name };
}
