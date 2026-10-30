<script lang="ts">
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import type { MarkdownDoc, Skill, Technology } from '$lib/content/types';

	let {
		markdown,
		skills,
		technologies
	}: { markdown?: MarkdownDoc; skills: Skill[]; technologies: Technology[] } = $props();
</script>

{#if markdown?.blocks.length}
	<aside class="tldr" aria-label="Summary">
		<p class="mb-1 text-xs text-muted-foreground">tl;dr</p>
		<MarkdownBlock {markdown} {skills} {technologies} />
	</aside>
{/if}
