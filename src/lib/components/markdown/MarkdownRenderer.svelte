<script lang="ts">
	import { cn } from '$lib/utils';
	import type { MarkdownDoc, MarkdownInlineNode, Skill, Technology } from '$lib/content/types';
	import MarkdownBlockNode from './MarkdownBlockNode.svelte';
	import MarkdownInlineNodeComponent from './MarkdownInlineNode.svelte';

	let {
		doc,
		inline,
		skills = [],
		technologies = [],
		class: className = ''
	}: {
		doc?: MarkdownDoc;
		inline?: MarkdownInlineNode[];
		skills?: Skill[];
		technologies?: Technology[];
		class?: string;
	} = $props();
</script>

{#if doc}
	<div
		class={cn(
			'markdown-block prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0',
			className
		)}
	>
		{#each doc.blocks as block}
			<MarkdownBlockNode node={block} {skills} {technologies} />
		{/each}
	</div>
{:else if inline}
	<span class={cn('markdown-inline', className)}>
		{#each inline as node}<MarkdownInlineNodeComponent {node} {skills} {technologies} />{/each}
	</span>
{/if}
