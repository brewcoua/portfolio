<script lang="ts">
	import MarkdownCode from './MarkdownCode.svelte';
	import MarkdownInlineNode from './MarkdownInlineNode.svelte';
	import MarkdownBlockNode from './MarkdownBlockNode.svelte';
	import type {
		MarkdownBlockNode as MarkdownBlockNodeType,
		Skill,
		Technology
	} from '$lib/content/types';

	let {
		node,
		skills = [],
		technologies = []
	}: { node: MarkdownBlockNodeType; skills?: Skill[]; technologies?: Technology[] } = $props();
</script>

{#if node.type === 'paragraph'}
	<p>
		{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
	</p>
{:else if node.type === 'heading'}
	{#if node.level === 1}
		<h1>
			{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
		</h1>
	{:else if node.level === 2}
		<h2>
			{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
		</h2>
	{:else if node.level === 3}
		<h3>
			{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
		</h3>
	{:else if node.level === 4}
		<h4>
			{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
		</h4>
	{:else if node.level === 5}
		<h5>
			{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
		</h5>
	{:else}
		<h6>
			{#each node.children as child}<MarkdownInlineNode node={child} {skills} {technologies} />{/each}
		</h6>
	{/if}
{:else if node.type === 'blockquote'}
	<blockquote>
		{#each node.children as block}
			<MarkdownBlockNode node={block} {skills} {technologies} />
		{/each}
	</blockquote>
{:else if node.type === 'list'}
	{#if node.ordered}
		<ol>
			{#each node.items as item}
				<li>
					{#each item as block}
						<MarkdownBlockNode node={block} {skills} {technologies} />
					{/each}
				</li>
			{/each}
		</ol>
	{:else}
		<ul>
			{#each node.items as item}
				<li>
					{#each item as block}
						<MarkdownBlockNode node={block} {skills} {technologies} />
					{/each}
				</li>
			{/each}
		</ul>
	{/if}
{:else if node.type === 'code'}
	<MarkdownCode value={node.value} language={node.language} />
{/if}
