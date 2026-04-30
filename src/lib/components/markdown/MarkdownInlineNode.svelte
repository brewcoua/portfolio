<script lang="ts">
	import MarkdownCode from './MarkdownCode.svelte';
	import MarkdownLink from './MarkdownLink.svelte';
	import MarkdownMention from './MarkdownMention.svelte';
	import MarkdownInlineNode from './MarkdownInlineNode.svelte';
	import type {
		MarkdownInlineNode as MarkdownInlineNodeType,
		Skill,
		Technology
	} from '$lib/content/types';

	let {
		node,
		skills = [],
		technologies = []
	}: { node: MarkdownInlineNodeType; skills?: Skill[]; technologies?: Technology[] } = $props();

	function inlineText(nodes: MarkdownInlineNodeType[]): string {
		return nodes
			.map((item) => {
				if (item.type === 'text' || item.type === 'inlineCode') return item.value;
				if (item.type === 'strong' || item.type === 'emphasis' || item.type === 'link') {
					return inlineText(item.children);
				}
				if (item.type === 'mention') return item.label;
				return '';
			})
			.join('');
	}
</script>

{#if node.type === 'text'}
	{node.value}
{:else if node.type === 'inlineCode'}
	<MarkdownCode value={node.value} inline />
{:else if node.type === 'strong'}
	<strong>
		{#each node.children as child}
			<MarkdownInlineNode node={child} {skills} {technologies} />
		{/each}
	</strong>
{:else if node.type === 'emphasis'}
	<em>
		{#each node.children as child}
			<MarkdownInlineNode node={child} {skills} {technologies} />
		{/each}
	</em>
{:else if node.type === 'link'}
	<MarkdownLink href={node.href} external={node.external} label={inlineText(node.children)} />
{:else if node.type === 'mention'}
	<MarkdownMention
		mentionKind={node.mentionKind}
		label={node.label}
		entityId={node.entityId}
		href={node.href}
		popoverTitle={node.popoverTitle}
		popoverBody={node.popoverBody}
		{skills}
		{technologies}
	/>
{/if}
