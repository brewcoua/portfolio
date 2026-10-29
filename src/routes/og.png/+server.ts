import type { RequestHandler } from './$types';
import { loadContent } from '$lib/server/content';
import { h, OG_H as H, OG_W as W, renderOgPng, toDataUri } from '$lib/server/og';
import logoRaw from '$lib/assets/logo.svg?raw';

export const prerender = true;

/** Strip pseudo-comments inside SVG path d="" values so strict parsers don't choke. */
function cleanSvg(raw: string): string {
	return raw.replace(/<!--.*?-->/gs, '').replace(/\s{2,}/g, ' ');
}

/** Replace currentColor with an explicit hex so img data-URI renders correctly. */
function colorizeSvg(raw: string, color: string): string {
	return cleanSvg(raw).replace(/currentColor/g, color);
}

export const GET: RequestHandler = async () => {
	const { profile } = await loadContent();

	const logoUri = toDataUri(colorizeSvg(logoRaw, '#ff6b2c'));

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
				backgroundColor: '#151412',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 80px',
				gap: 56,
				fontFamily: 'JetBrains Mono',
			}
		},
		// Logo
		h('img', { src: logoUri, width: LOGO_W, height: LOGO_H, style: { display: 'block', flexShrink: 0 } }),
		// Text column
		h(
			'div',
			{ style: { display: 'flex', flexDirection: 'column', gap: 16 } },
			h('span', { style: { fontSize: 64, fontWeight: 700, color: '#e8e4da', lineHeight: 1.1 } }, profile.name.toLowerCase()),
			h('span', { style: { fontSize: 30, fontWeight: 700, color: '#928d82', lineHeight: 1.3 } }, profile.headline)
		)
	);

	return renderOgPng(tree);
};
