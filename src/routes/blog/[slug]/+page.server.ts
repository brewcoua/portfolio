import { error } from '@sveltejs/kit';
import { loadContent } from '$lib/server/content';

export async function entries() {
	const { posts } = await loadContent();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function load({ params }) {
	const content = await loadContent();
	const post = content.posts.find((item) => item.slug === params.slug);
	if (!post) throw error(404, 'Post not found');

	return {
		title: post.title,
		post,
		technologies: content.technologies,
		skills: content.skills
	};
}
