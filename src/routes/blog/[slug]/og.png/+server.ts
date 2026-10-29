import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { loadContent } from '$lib/server/content';
import { figurePng, h, OG_COLORS as C, OG_H, OG_W, renderOgPng } from '$lib/server/og';

export const prerender = true;

export async function entries() {
	const { posts } = await loadContent();
	return posts.filter((post) => post.cover).map((post) => ({ slug: post.slug }));
}

/** The figure classes from layout.css, resolved to fixed colours: resvg sees no page CSS. */
const FIGURE_STYLE = `<style>
svg{fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;font-size:13px;font-family:'JetBrains Mono'}
.ink{stroke:${C.fg}}.dim{stroke:${C.muted}}.hl{stroke:${C.accent}}.paper{fill:${C.bg}}
.fill-ink{fill:${C.fg};fill-opacity:.12}.fill-hl{fill:${C.accent};fill-opacity:.18}
text{fill:${C.fg};stroke:none}text.dim{fill:${C.muted};stroke:none}text.hl{fill:${C.accent};stroke:none}
</style>`;

export const GET: RequestHandler = async ({ params }) => {
	const { posts, profile } = await loadContent();
	const post = posts.find((item) => item.slug === params.slug);
	if (!post?.cover) throw error(404, 'Post not found');

	const cover = post.cover.replace(/<svg[^>]*>/, (open) => open + FIGURE_STYLE);

	const tree = h(
		'div',
		{
			style: {
				display: 'flex',
				width: OG_W,
				height: OG_H,
				backgroundColor: C.bg,
				alignItems: 'center',
				padding: '0 56px',
				gap: 40,
				fontFamily: 'JetBrains Mono'
			}
		},
		h(
			'div',
			{ style: { display: 'flex', flexDirection: 'column', gap: 20, width: 380 } },
			h('span', { style: { fontSize: 24, color: C.muted } }, `${profile.name.toLowerCase()} · blog`),
			h('span', { style: { fontSize: 52, fontWeight: 700, color: C.fg, lineHeight: 1.15 } }, post.title)
		),
		h('img', { src: await figurePng(cover, 1400), width: 700, height: 368, style: { display: 'block' } })
	);

	return renderOgPng(tree);
};
