import type { MarkdownDoc, MarkdownInlineNode } from '$lib/content/types';
import { applyMentions, type MentionDictionaries } from './mentions';
import { normalizeMarkdownAst } from './normalize';
import { parseMarkdown } from './parse';
import { sanitizeMarkdownDoc } from './sanitize';

type RenderOptions = {
	mentions?: MentionDictionaries;
};

const DOC_CACHE = new Map<string, MarkdownDoc>();

function cacheKey(source: string, mentions?: MentionDictionaries): string {
	return `${source}::${mentions ? 'mentions' : 'plain'}`;
}

export function renderMarkdownDoc(source: string | undefined, options: RenderOptions = {}): MarkdownDoc {
	const value = source?.trim();
	if (!value) return { blocks: [] };
	const key = cacheKey(value, options.mentions);
	const cached = DOC_CACHE.get(key);
	if (cached) return cached;

	const ast = parseMarkdown(value);
	const normalized = normalizeMarkdownAst(ast);
	const withMentions = applyMentions(normalized, options.mentions);
	const sanitized = sanitizeMarkdownDoc(withMentions);
	DOC_CACHE.set(key, sanitized);
	return sanitized;
}

export function renderMarkdownInline(source: string | undefined, options: RenderOptions = {}): MarkdownInlineNode[] {
	const doc = renderMarkdownDoc(source, options);
	if (doc.blocks.length === 0) return [];
	if (doc.blocks.length === 1 && doc.blocks[0].type === 'paragraph') {
		return doc.blocks[0].children;
	}
	return [{ type: 'text', value: markdownDocToPlainText(doc) }];
}

export function markdownInlineToPlainText(nodes: MarkdownInlineNode[]): string {
	return nodes
		.map((node) => {
			if (node.type === 'text' || node.type === 'inlineCode') return node.value;
			if (node.type === 'mention') return node.label;
			if (node.type === 'strong' || node.type === 'emphasis' || node.type === 'link') {
				return markdownInlineToPlainText(node.children);
			}
			return '';
		})
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function markdownDocToPlainText(doc: MarkdownDoc): string {
	const chunks: string[] = [];
	for (const block of doc.blocks) {
		if (block.type === 'paragraph' || block.type === 'heading') {
			chunks.push(markdownInlineToPlainText(block.children));
			continue;
		}
		if (block.type === 'blockquote') {
			chunks.push(markdownDocToPlainText({ blocks: block.children }));
			continue;
		}
		if (block.type === 'list') {
			for (const item of block.items) chunks.push(markdownDocToPlainText({ blocks: item }));
			continue;
		}
		if (block.type === 'code') {
			chunks.push(block.value);
		}
	}
	return chunks.join(' ').replace(/\s+/g, ' ').trim();
}

export type { MentionDictionaries, MentionLinkTarget, MentionPopoverTarget } from './mentions';
