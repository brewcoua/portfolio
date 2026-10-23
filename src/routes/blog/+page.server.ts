import { loadContent } from '$lib/server/content';

export async function load() {
	const { posts } = await loadContent();
	return { title: 'Blog', posts };
}
