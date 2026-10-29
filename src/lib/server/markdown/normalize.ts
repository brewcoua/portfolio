import type { CalloutKind, MarkdownBlockNode, MarkdownDoc, MarkdownInlineNode } from '$lib/content/types';
import type { MdastNode } from './parse';

const CALLOUT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

/** Footnote definitions of the doc being normalized, numbered in order of first reference. */
let footnotes = new Map<string, MdastNode>();
let footnoteNumbers = new Map<string, number>();

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
		case 'footnoteReference': {
			const id = node.identifier ?? '';
			const definition = footnotes.get(id);
			if (!definition) return [];
			if (!footnoteNumbers.has(id)) footnoteNumbers.set(id, footnoteNumbers.size + 1);
			const children = (definition.children ?? []).flatMap((child) => normalizeInlineNodes(child.children ?? []));
			return [{ type: 'sidenote', n: footnoteNumbers.get(id)!, children }];
		}
		default:
			return normalizeInlineNodes(node.children ?? []);
	}
}

function normalizeInlineNodes(nodes: MdastNode[]): MarkdownInlineNode[] {
	return nodes.flatMap((node) => normalizeInline(node));
}

function normalizeBlock(node: MdastNode): MarkdownBlockNode[] {
	switch (node.type) {
		case 'paragraph': {
			const [only] = node.children ?? [];
			if (node.children?.length === 1 && only.type === 'image') {
				return [{ type: 'figure', src: only.url ?? '', caption: only.alt ?? '' }];
			}
			return [{ type: 'paragraph', children: normalizeInlineNodes(node.children ?? []) }];
		}
		case 'heading': {
			const depth = node.depth ?? 2;
			const level = Math.max(1, Math.min(6, depth)) as 1 | 2 | 3 | 4 | 5 | 6;
			return [{ type: 'heading', level, children: normalizeInlineNodes(node.children ?? []) }];
		}
		case 'blockquote': {
			const children = normalizeBlocks(node.children ?? []);
			const [first] = children;
			const lead = first?.type === 'paragraph' ? first.children[0] : undefined;
			const match = lead?.type === 'text' ? CALLOUT.exec(lead.value) : null;
			if (!match || first.type !== 'paragraph' || lead?.type !== 'text') return [{ type: 'blockquote', children }];
			const rest = lead.value.slice(match[0].length);
			const paragraph = [...(rest ? [{ ...lead, value: rest }] : []), ...first.children.slice(1)];
			return [
				{
					type: 'callout',
					kind: match[1].toLowerCase() as CalloutKind,
					children: [...(paragraph.length ? [{ ...first, children: paragraph }] : []), ...children.slice(1)]
				}
			];
		}
		case 'footnoteDefinition':
			return [];
		case 'list':
			return [
				{
					type: 'list',
					ordered: Boolean(node.ordered),
					items: (node.children ?? []).map((item) => normalizeBlocks(item.children ?? []))
				}
			];
		case 'code': {
			const title = /\btitle=(?:"([^"]*)"|(\S+))/.exec(node.meta ?? '');
			return [{ type: 'code', language: node.lang ?? undefined, title: title?.[1] ?? title?.[2], value: node.value ?? '' }];
		}
		default:
			return normalizeBlocks(node.children ?? []);
	}
}

function normalizeBlocks(nodes: MdastNode[]): MarkdownBlockNode[] {
	return nodes.flatMap((node) => normalizeBlock(node));
}

export function normalizeMarkdownAst(root: MdastNode): MarkdownDoc {
	footnotes = new Map(
		(root.children ?? []).filter((node) => node.type === 'footnoteDefinition').map((node) => [node.identifier ?? '', node])
	);
	footnoteNumbers = new Map();
	return {
		blocks: normalizeBlocks(root.children ?? [])
	};
}
