import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';
import { loadContent } from '$lib/server/content';
import { listCvVariants, resolveCv } from '$lib/server/cv/resolve';
import { compileCv } from '$lib/server/cv/typst';

export const prerender = true;

// `main` is served at /cv.pdf; tailored variants live under /cv/<name>.pdf.
export const entries: EntryGenerator = async () =>
	(await listCvVariants()).filter((variant) => variant !== 'main').map((variant) => ({ variant }));

export const GET: RequestHandler = async ({ params }) => {
	if (params.variant === 'main' || !(await listCvVariants()).includes(params.variant)) error(404);
	const pdf = compileCv(await resolveCv(params.variant, await loadContent()));
	return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf' } });
};
