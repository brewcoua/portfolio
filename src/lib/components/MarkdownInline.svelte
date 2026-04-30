<script lang="ts">
	import MarkdownRenderer from '$lib/components/markdown/MarkdownRenderer.svelte';
	import type { MarkdownInlineNode, Skill, Technology } from '$lib/content/types';

	let {
		markdown,
		skills = [],
		technologies = [],
		class: className = ''
	}: {
		markdown?: MarkdownInlineNode[];
		skills?: Skill[];
		technologies?: Technology[];
		class?: string;
	} = $props();
</script>

<MarkdownRenderer inline={markdown} {skills} {technologies} class={className} />
