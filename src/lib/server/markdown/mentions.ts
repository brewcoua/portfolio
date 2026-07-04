import type {
	MarkdownBlockNode,
	MarkdownDoc,
	MarkdownInlineNode,
	MarkdownMentionKind
} from '$lib/content/types';

/** Custom URL scheme the loader rewrites `[[wikilinks]]` into before parsing. */
export const WIKILINK_SCHEME = 'wikilink:';

export type MentionLinkTarget = {
	kind: 'project' | 'experience' | 'education' | 'publication' | 'role';
	href: string;
};

export type MentionPopoverTarget = {
	kind: 'skill' | 'technology';
	entityId: string;
	title: string;
	body: string;
};

export type MentionTarget = MentionLinkTarget | MentionPopoverTarget;

/** Resolver keyed by canonical node path (`type/slug`). */
export type MentionDictionaries = ReadonlyMap<string, MentionTarget>;

function inlineText(nodes: MarkdownInlineNode[]): string {
	return nodes
		.map((node) => {
			if (node.type === 'text' || node.type === 'inlineCode') return node.value;
			if (node.type === 'strong' || node.type === 'emphasis' || node.type === 'link') {
				return inlineText(node.children);
			}
			if (node.type === 'mention') return node.label;
			return '';
		})
		.join('');
}

function toMention(
	target: MentionTarget,
	label: string
): Extract<MarkdownInlineNode, { type: 'mention' }> {
	if ('entityId' in target) {
		return {
			type: 'mention',
			mentionKind: target.kind satisfies MarkdownMentionKind,
			label,
			entityId: target.entityId,
			popoverTitle: target.title,
			popoverBody: target.body
		};
	}
	return {
		type: 'mention',
		mentionKind: target.kind satisfies MarkdownMentionKind,
		label,
		href: target.href
	};
}

function transformInlineNodes(
	nodes: MarkdownInlineNode[],
	dictionaries: MentionDictionaries
): MarkdownInlineNode[] {
	const transformed: MarkdownInlineNode[] = [];
	for (const node of nodes) {
		if (node.type === 'strong' || node.type === 'emphasis') {
			transformed.push({ ...node, children: transformInlineNodes(node.children, dictionaries) });
			continue;
		}
		if (node.type === 'link') {
			if (node.href.startsWith(WIKILINK_SCHEME)) {
				const path = node.href.slice(WIKILINK_SCHEME.length);
				const target = dictionaries.get(path);
				if (target) {
					transformed.push(toMention(target, inlineText(node.children)));
					continue;
				}
			}
			transformed.push({ ...node, children: transformInlineNodes(node.children, dictionaries) });
			continue;
		}
		transformed.push(node);
	}
	return transformed;
}

function transformBlockNodes(
	nodes: MarkdownBlockNode[],
	dictionaries: MentionDictionaries
): MarkdownBlockNode[] {
	return nodes.map((node) => {
		if (node.type === 'paragraph' || node.type === 'heading') {
			return { ...node, children: transformInlineNodes(node.children, dictionaries) };
		}
		if (node.type === 'blockquote') {
			return { ...node, children: transformBlockNodes(node.children, dictionaries) };
		}
		if (node.type === 'list') {
			return { ...node, items: node.items.map((item) => transformBlockNodes(item, dictionaries)) };
		}
		return node;
	});
}

export function applyMentions(doc: MarkdownDoc, dictionaries?: MentionDictionaries): MarkdownDoc {
	if (!dictionaries || dictionaries.size === 0) return doc;
	return { blocks: transformBlockNodes(doc.blocks, dictionaries) };
}
