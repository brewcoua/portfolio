import { createCssVariablesTheme, createHighlighter, type BundledLanguage, type Highlighter } from 'shiki';
import type { MarkdownBlockNode, MarkdownDoc } from '$lib/content/types';

// Colours are `var(--shiki-…)` references, defined from the palette in layout.css, so one build fits every theme.
const theme = createCssVariablesTheme({ name: 'site', variablePrefix: '--shiki-', fontStyle: true });
const LANGS: BundledLanguage[] = ['yaml', 'hcl', 'bash', 'shell', 'ts', 'js', 'json', 'toml', 'nix', 'dockerfile'];
const FONT_STYLE_ITALIC = 1;

let highlighter: Promise<Highlighter> | undefined;

function highlightBlocks(blocks: MarkdownBlockNode[], shiki: Highlighter): MarkdownBlockNode[] {
	return blocks.map((block) => {
		if (block.type === 'code' && block.language && shiki.getLoadedLanguages().includes(block.language)) {
			const lines = shiki.codeToTokensBase(block.value, { lang: block.language as BundledLanguage, theme });
			return {
				...block,
				lines: lines.map((line) =>
					line.map((token) => ({
						content: token.content,
						color: token.color,
						italic: ((token.fontStyle ?? 0) & FONT_STYLE_ITALIC) !== 0 || undefined
					}))
				)
			};
		}
		if (block.type === 'blockquote' || block.type === 'callout') {
			return { ...block, children: highlightBlocks(block.children, shiki) };
		}
		if (block.type === 'list') return { ...block, items: block.items.map((item) => highlightBlocks(item, shiki)) };
		return block;
	});
}

export async function highlightDoc(doc: MarkdownDoc): Promise<MarkdownDoc> {
	highlighter ??= createHighlighter({ themes: [theme], langs: LANGS });
	return { blocks: highlightBlocks(doc.blocks, await highlighter) };
}
