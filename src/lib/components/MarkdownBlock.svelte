<script lang="ts">
	import MarkdownRenderer from '$lib/components/markdown/MarkdownRenderer.svelte';
	import type { MarkdownDoc, Skill, Technology } from '$lib/content/types';

	let {
		markdown,
		skills = [],
		technologies = [],
		class: className = ''
	}: {
		markdown?: MarkdownDoc;
		skills?: Skill[];
		technologies?: Technology[];
		class?: string;
	} = $props();
</script>

<MarkdownRenderer doc={markdown} {skills} {technologies} class={className} />
