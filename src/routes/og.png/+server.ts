import type { RequestHandler } from './$types';
import { loadContent } from '$lib/server/content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import logoRaw from '$lib/assets/logo.svg?raw';

export const prerender = true;

const W = 1200;
const H = 630;

/** Strip pseudo-comments inside SVG path d="" values so strict parsers don't choke. */
function cleanSvg(raw: string): string {
	return raw.replace(/<!--.*?-->/gs, '').replace(/\s{2,}/g, ' ');
}

/** Replace currentColor with an explicit hex so img data-URI renders correctly. */
function colorizeSvg(raw: string, color: string): string {
	return cleanSvg(raw).replace(/currentColor/g, color);
}

function toDataUri(svg: string): string {
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/** Minimal h() so we can build a satori VDOM without importing React. */
function h(
	type: string,
	props: Record<string, unknown>,
	...children: unknown[]
): unknown {
	const resolved = children.length === 0 ? undefined : children.length === 1 ? children[0] : children;
	return { type, key: null, props: resolved !== undefined ? { ...props, children: resolved } : props };
}

export const GET: RequestHandler = async () => {
	const { profile } = await loadContent();

	const fontData = await readFile(
		join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
	);

	const logoUri = toDataUri(colorizeSvg(logoRaw, '#f1f5f9'));

	// Logo viewBox is 100x150 → scale to height 160 → width ≈ 107
	const LOGO_H = 160;
	const LOGO_W = Math.round((100 / 150) * LOGO_H);

	const tree = h(
		'div',
		{
			style: {
				display: 'flex',
				width: W,
				height: H,
				backgroundColor: '#0d1117',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 80px',
				gap: 56,
				fontFamily: 'Inter',
			}
		},
		// Logo
		h('img', { src: logoUri, width: LOGO_W, height: LOGO_H, style: { display: 'block', flexShrink: 0 } }),
		// Text column
		h(
			'div',
			{ style: { display: 'flex', flexDirection: 'column', gap: 16 } },
			h('span', { style: { fontSize: 72, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-1px' } }, profile.name),
			h('span', { style: { fontSize: 32, fontWeight: 700, color: '#475569', lineHeight: 1.3 } }, profile.headline)
		)
	);

	const svg = await satori(tree as Parameters<typeof satori>[0], {
		width: W,
		height: H,
		fonts: [
			{
				name: 'Inter',
				data: fontData,
				weight: 700,
				style: 'normal'
			}
		]
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } });
	const png = resvg.render().asPng();

	return new Response(png.buffer as ArrayBuffer, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
