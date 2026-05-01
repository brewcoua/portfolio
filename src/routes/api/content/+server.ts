import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadContent } from '$lib/server/content';

/** Full enriched portfolio (YAML + markdown AST). Baked at build time for static hosting. */
export const prerender = true;

export const GET: RequestHandler = async () => {
	const data = await loadContent();
	return json(data, {
		headers: {
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
