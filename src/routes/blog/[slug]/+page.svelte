<script lang="ts">
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';

	let { data } = $props();
</script>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm text-muted-foreground"># post</p>
		<h1 class="text-xl font-bold leading-snug">{data.post.title}</h1>
		<p class="text-sm text-muted-foreground">{data.post.date}</p>
	</header>

	<MarkdownBlock markdown={data.post.body} skills={data.skills} technologies={data.technologies} />
</article>
