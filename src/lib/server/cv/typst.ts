import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import template from './cv.typ?raw';

// `;` too: right after an embedded `#strong[..]` call Typst would eat it as a statement terminator.
const SPECIAL = /[\\#$*_@<>[\]`~/;]/g;
// Content writes "~15" for "about 15"; print it as LaTeX's $\sim$ did.
const escape = (text: string) => text.replace(SPECIAL, (char) => (char === '~' ? '∼' : `\\${char}`));
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Markdown-lite (`**bold**`, `[text](url)`) to Typst markup; everything else is literal. */
export function toTypst(source: string): string {
	let out = '';
	let last = 0;
	for (const match of source.matchAll(TOKEN)) {
		out += escape(source.slice(last, match.index));
		const [, bold, text, url] = match;
		out += bold !== undefined ? `#strong[${toTypst(bold)}]` : `#link("${url.replace(/"/g, '\\"')}")[${escape(text)}]`;
		last = match.index + match[0].length;
	}
	return out + escape(source.slice(last));
}

let compiler: NodeCompiler | undefined;

/** Compile the CV template against `data` (exposed to Typst as `sys.inputs.data`). */
export function compileCv(data: unknown): Buffer {
	compiler ??= NodeCompiler.create();
	return compiler.pdf({ mainFileContent: template, inputs: { data: JSON.stringify(data) } });
}
