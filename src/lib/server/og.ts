import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';

export const OG_W = 1200;
export const OG_H = 630;

/** Dark paper palette from layout.css; OG images are rendered once, so they pick one theme. */
export const OG_COLORS = { bg: '#151412', fg: '#e8e4da', muted: '#928d82', accent: '#ff6b2c' };

export function toDataUri(svg: string): string {
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/** Minimal h() so we can build a satori VDOM without importing React. */
export function h(type: string, props: Record<string, unknown>, ...children: unknown[]): unknown {
	const resolved = children.length === 0 ? undefined : children.length === 1 ? children[0] : children;
	return { type, key: null, props: resolved !== undefined ? { ...props, children: resolved } : props };
}

const fontPath = (weight: number) =>
	join(process.cwd(), `node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`);

/** resvg only reads sfnt fonts, and fontsource ships WOFF: unwrap it (WOFF 1.0 = zlib-compressed sfnt tables). */
function woffToSfnt(woff: Buffer): Buffer {
	const numTables = woff.readUInt16BE(12);
	const dir = Array.from({ length: numTables }, (_, i) => {
		const at = 44 + i * 20;
		const [offset, compLength, origLength] = [4, 8, 12].map((o) => woff.readUInt32BE(at + o));
		const raw = woff.subarray(offset, offset + compLength);
		return {
			tag: woff.subarray(at, at + 4),
			checksum: woff.readUInt32BE(at + 16),
			data: compLength < origLength ? inflateSync(raw) : raw
		};
	});
	const head = Buffer.alloc(12 + numTables * 16);
	woff.copy(head, 0, 4, 8); // sfnt flavor
	const log2 = Math.floor(Math.log2(numTables));
	head.writeUInt16BE(numTables, 4);
	head.writeUInt16BE(16 * 2 ** log2, 6);
	head.writeUInt16BE(log2, 8);
	head.writeUInt16BE(numTables * 16 - 16 * 2 ** log2, 10);
	const body: Buffer[] = [];
	let offset = head.length;
	dir.forEach(({ tag, checksum, data }, i) => {
		tag.copy(head, 12 + i * 16);
		head.writeUInt32BE(checksum, 16 + i * 16);
		head.writeUInt32BE(offset, 20 + i * 16);
		head.writeUInt32BE(data.length, 24 + i * 16);
		const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
		data.copy(padded);
		body.push(padded);
		offset += padded.length;
	});
	return Buffer.concat([head, ...body]);
}

/** Rasterise a blog figure on its own: satori can't draw SVG text, and resvg skips text in nested images. */
export async function figurePng(svg: string, width: number): Promise<string> {
	// resvg-js 2.x only loads fonts from files.
	const fontFile = join(tmpdir(), 'og-jetbrains-mono-400.ttf');
	await writeFile(fontFile, woffToSfnt(await readFile(fontPath(400))));
	const png = new Resvg(svg, {
		fitTo: { mode: 'width', value: width },
		font: { fontFiles: [fontFile], defaultFontFamily: 'JetBrains Mono', loadSystemFonts: false }
	})
		.render()
		.asPng();
	return `data:image/png;base64,${png.toString('base64')}`;
}

export async function renderOgPng(tree: unknown): Promise<Response> {
	const fontData = await readFile(fontPath(700));
	const svg = await satori(tree as Parameters<typeof satori>[0], {
		width: OG_W,
		height: OG_H,
		fonts: [{ name: 'JetBrains Mono', data: fontData, weight: 700, style: 'normal' }]
	});
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_W } }).render().asPng();
	return new Response(png.buffer as ArrayBuffer, {
		headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' }
	});
}
