import type { MarkdownBlockNode, MarkdownDoc, MarkdownInlineNode } from '$lib/content/types';
import type { MdastNode } from './parse';

function normalizeInline(node: MdastNode): MarkdownInlineNode[] {
	switch (node.type) {
		case 'text':
			return [{ type: 'text', value: node.value ?? '' }];
		case 'strong':
			return [{ type: 'strong', children: normalizeInlineNodes(node.children ?? []) }];
		case 'emphasis':
			return [{ type: 'emphasis', children: normalizeInlineNodes(node.children ?? []) }];
		case 'inlineCode':
			return [{ type: 'inlineCode', value: node.value ?? '' }];
		case 'link':
			return [
				{
					type: 'link',
					href: node.url ?? '',
					external: /^(https?:|mailto:)/.test(node.url ?? ''),
					children: normalizeInlineNodes(node.children ?? [])
				}
			];
		default:
			return normalizeInlineNodes(node.children ?? []);
	}
}

function normalizeInlineNodes(nodes: MdastNode[]): MarkdownInlineNode[] {
	return nodes.flatMap((node) => normalizeInline(node));
}

function normalizeBlock(node: MdastNode): MarkdownBlockNode[] {
	switch (node.type) {
		case 'paragraph':
			return [{ type: 'paragraph', children: normalizeInlineNodes(node.children ?? []) }];
		case 'heading': {
			const depth = node.depth ?? 2;
			const level = Math.max(1, Math.min(6, depth)) as 1 | 2 | 3 | 4 | 5 | 6;
			return [{ type: 'heading', level, children: normalizeInlineNodes(node.children ?? []) }];
		}
		case 'blockquote':
			return [{ type: 'blockquote', children: normalizeBlocks(node.children ?? []) }];
		case 'list':
			return [
				{
					type: 'list',
					ordered: Boolean(node.ordered),
					items: (node.children ?? []).map((item) => normalizeBlocks(item.children ?? []))
				}
			];
		case 'code':
			return [{ type: 'code', language: node.lang, value: node.value ?? '' }];
		default:
			return normalizeBlocks(node.children ?? []);
	}
}

function normalizeBlocks(nodes: MdastNode[]): MarkdownBlockNode[] {
	return nodes.flatMap((node) => normalizeBlock(node));
}

export function normalizeMarkdownAst(root: MdastNode): MarkdownDoc {
	return {
		blocks: normalizeBlocks(root.children ?? [])
	};
}
