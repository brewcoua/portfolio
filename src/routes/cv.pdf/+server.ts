import type { RequestHandler } from './$types';
import { loadContent } from '$lib/server/content';
import { resolveCv } from '$lib/server/cv/resolve';
import { compileCv } from '$lib/server/cv/typst';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const pdf = compileCv(await resolveCv('main', await loadContent()));
	return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf' } });
};
