import type { MarkdownBlockNode, MarkdownDoc, MarkdownInlineNode } from '$lib/content/types';

function sanitizeInline(nodes: MarkdownInlineNode[]): MarkdownInlineNode[] {
	return nodes.flatMap((node) => {
		if (node.type === 'link') {
			const href = node.href.trim();
			const isAllowed = href.startsWith('/') || /^(https?:|mailto:)/.test(href);
			if (!isAllowed) return sanitizeInline(node.children);
			return [
				{
					...node,
					href,
					external: /^(https?:|mailto:)/.test(href),
					children: sanitizeInline(node.children)
				}
			];
		}
		if (node.type === 'strong' || node.type === 'emphasis') {
			return [{ ...node, children: sanitizeInline(node.children) }];
		}
		return [node];
	});
}

function sanitizeBlocks(nodes: MarkdownBlockNode[]): MarkdownBlockNode[] {
	return nodes.map((node) => {
		if (node.type === 'paragraph' || node.type === 'heading') {
			return {
				...node,
				children: sanitizeInline(node.children)
			};
		}
		if (node.type === 'blockquote') {
			return {
				...node,
				children: sanitizeBlocks(node.children)
			};
		}
		if (node.type === 'list') {
			return {
				...node,
				items: node.items.map((item) => sanitizeBlocks(item))
			};
		}
		return node;
	});
}

export function sanitizeMarkdownDoc(doc: MarkdownDoc): MarkdownDoc {
	return { blocks: sanitizeBlocks(doc.blocks) };
}
