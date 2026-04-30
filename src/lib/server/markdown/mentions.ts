import type {
	MarkdownBlockNode,
	MarkdownDoc,
	MarkdownInlineNode,
	MarkdownMentionKind
} from '$lib/content/types';

export type MentionLinkTarget = {
	kind: MarkdownMentionKind;
	href: string;
};

export type MentionPopoverTarget = {
	kind: 'skill' | 'technology';
	entityId: string;
	title: string;
	body: string;
};

export type MentionDictionaries = {
	tokenToLink: ReadonlyMap<string, MentionLinkTarget>;
	labelToLink: ReadonlyMap<string, MentionLinkTarget>;
	labelToPopover: ReadonlyMap<string, MentionPopoverTarget>;
};

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

function applyMentionDetectionToText(
	value: string,
	dictionaries: MentionDictionaries,
	labelPattern: RegExp | null
): MarkdownInlineNode[] {
	if (!labelPattern) return [{ type: 'text', value }];
	const output: MarkdownInlineNode[] = [];
	let cursor = 0;
	labelPattern.lastIndex = 0;
	let match = labelPattern.exec(value);
	while (match) {
		const start = match.index;
		const end = start + match[0].length;
		if (start > cursor) output.push({ type: 'text', value: value.slice(cursor, start) });
		const key = match[0].toLowerCase();
		const link = dictionaries.labelToLink.get(key);
		if (link) {
			output.push({
				type: 'mention',
				mentionKind: link.kind,
				label: match[0],
				href: link.href
			});
		} else {
			const popover = dictionaries.labelToPopover.get(key);
			if (popover) {
				output.push({
					type: 'mention',
					mentionKind: popover.kind,
					label: match[0],
					entityId: popover.entityId,
					popoverTitle: popover.title,
					popoverBody: popover.body
				});
			} else {
				output.push({ type: 'text', value: match[0] });
			}
		}
		cursor = end;
		match = labelPattern.exec(value);
	}
	if (cursor < value.length) output.push({ type: 'text', value: value.slice(cursor) });
	return output;
}

function transformInlineNodes(
	nodes: MarkdownInlineNode[],
	dictionaries: MentionDictionaries,
	labelPattern: RegExp | null
): MarkdownInlineNode[] {
	const transformed: MarkdownInlineNode[] = [];
	for (const node of nodes) {
		if (node.type === 'text') {
			transformed.push(...applyMentionDetectionToText(node.value, dictionaries, labelPattern));
			continue;
		}
		if (node.type === 'strong' || node.type === 'emphasis') {
			transformed.push({
				...node,
				children: transformInlineNodes(node.children, dictionaries, labelPattern)
			});
			continue;
		}
		if (node.type === 'link') {
			if (node.href.startsWith('@')) {
				const token = node.href.slice(1).trim().toLowerCase();
				const resolved = dictionaries.tokenToLink.get(token);
				if (resolved) {
					transformed.push({
						type: 'mention',
						mentionKind: resolved.kind,
						label: inlineText(node.children),
						href: resolved.href
					});
					continue;
				}
			}
			transformed.push({
				...node,
				children: transformInlineNodes(node.children, dictionaries, labelPattern)
			});
			continue;
		}
		transformed.push(node);
	}
	return transformed;
}

function transformBlockNodes(
	nodes: MarkdownBlockNode[],
	dictionaries: MentionDictionaries,
	labelPattern: RegExp | null
): MarkdownBlockNode[] {
	return nodes.map((node) => {
		if (node.type === 'paragraph' || node.type === 'heading') {
			return {
				...node,
				children: transformInlineNodes(node.children, dictionaries, labelPattern)
			};
		}
		if (node.type === 'blockquote') {
			return {
				...node,
				children: transformBlockNodes(node.children, dictionaries, labelPattern)
			};
		}
		if (node.type === 'list') {
			return {
				...node,
				items: node.items.map((item) => transformBlockNodes(item, dictionaries, labelPattern))
			};
		}
		return node;
	});
}

function buildLabelPattern(dictionaries: MentionDictionaries): RegExp | null {
	const labels = [...new Set([...dictionaries.labelToLink.keys(), ...dictionaries.labelToPopover.keys()])]
		.filter((label) => label.length > 1)
		.sort((a, b) => b.length - a.length);
	if (labels.length === 0) return null;
	return new RegExp(`(?<![\\w])(${labels.map((label) => escapeRegex(label)).join('|')})(?![\\w])`, 'gi');
}

export function applyMentions(doc: MarkdownDoc, dictionaries?: MentionDictionaries): MarkdownDoc {
	if (!dictionaries) return doc;
	const labelPattern = buildLabelPattern(dictionaries);
	return {
		blocks: transformBlockNodes(doc.blocks, dictionaries, labelPattern)
	};
}
