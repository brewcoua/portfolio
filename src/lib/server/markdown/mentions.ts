import { citeLabel, type Reference } from '$lib/content/apa';
import type {
	MarkdownBlockNode,
	MarkdownDoc,
	MarkdownInlineNode,
	MarkdownMentionKind
} from '$lib/content/types';

/** Custom URL scheme the loader rewrites `[[wikilinks]]` into before parsing. */
export const WIKILINK_SCHEME = 'wikilink:';

/** Schemes the loader rewrites `[@a; @b]` and narrative `@a` citations into; keys are `;`-separated. */
export const CITE_SCHEME = 'cite:';
export const CITE_NARRATIVE_SCHEME = 'citet:';

export type ReferenceDictionary = ReadonlyMap<string, Reference>;

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
			if (node.type === 'mention' || node.type === 'citation') return node.label;
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

function toCitation(href: string, references: ReferenceDictionary): MarkdownInlineNode | undefined {
	const narrative = href.startsWith(CITE_NARRATIVE_SCHEME);
	if (!narrative && !href.startsWith(CITE_SCHEME)) return undefined;
	const keys = href.slice(narrative ? CITE_NARRATIVE_SCHEME.length : CITE_SCHEME.length).split(';');
	const items = keys.map((key) => references.get(key)).filter((ref) => ref !== undefined);
	if (items.length !== keys.length) return undefined;
	return { type: 'citation', label: citeLabel(items, narrative), items };
}

function transformInlineNodes(
	nodes: MarkdownInlineNode[],
	dictionaries: MentionDictionaries,
	references: ReferenceDictionary
): MarkdownInlineNode[] {
	const transformed: MarkdownInlineNode[] = [];
	for (const node of nodes) {
		if (node.type === 'strong' || node.type === 'emphasis' || node.type === 'sidenote') {
			transformed.push({ ...node, children: transformInlineNodes(node.children, dictionaries, references) });
			continue;
		}
		if (node.type === 'link') {
			const citation = toCitation(node.href, references);
			if (citation) {
				transformed.push(citation);
				continue;
			}
			if (node.href.startsWith(WIKILINK_SCHEME)) {
				const path = node.href.slice(WIKILINK_SCHEME.length);
				const target = dictionaries.get(path);
				if (target) {
					transformed.push(toMention(target, inlineText(node.children)));
					continue;
				}
			}
			transformed.push({ ...node, children: transformInlineNodes(node.children, dictionaries, references) });
			continue;
		}
		// The citation renders as a button, which lets a line break before the punctuation after it.
		const previous = transformed.at(-1);
		if (node.type === 'text' && previous?.type === 'citation') {
			const punctuation = /^[.,;:!?)]+/.exec(node.value)?.[0];
			if (punctuation) {
				previous.trailing = punctuation;
				if (node.value.length > punctuation.length) transformed.push({ ...node, value: node.value.slice(punctuation.length) });
				continue;
			}
		}
		transformed.push(node);
	}
	return transformed;
}

function transformBlockNodes(
	nodes: MarkdownBlockNode[],
	dictionaries: MentionDictionaries,
	references: ReferenceDictionary
): MarkdownBlockNode[] {
	return nodes.map((node) => {
		if (node.type === 'paragraph' || node.type === 'heading') {
			return { ...node, children: transformInlineNodes(node.children, dictionaries, references) };
		}
		if (node.type === 'blockquote' || node.type === 'callout') {
			return { ...node, children: transformBlockNodes(node.children, dictionaries, references) };
		}
		if (node.type === 'list') {
			return { ...node, items: node.items.map((item) => transformBlockNodes(item, dictionaries, references)) };
		}
		return node;
	});
}

export function applyMentions(
	doc: MarkdownDoc,
	dictionaries: MentionDictionaries = new Map(),
	references: ReferenceDictionary = new Map()
): MarkdownDoc {
	if (dictionaries.size === 0 && references.size === 0) return doc;
	return { blocks: transformBlockNodes(doc.blocks, dictionaries, references) };
}
