<script lang="ts">
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import References from '$lib/components/References.svelte';
	import Tldr from '$lib/components/Tldr.svelte';
	import Toc from '$lib/components/Toc.svelte';

	let { data } = $props();
</script>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm text-muted-foreground"># post</p>
		<h1 class="text-xl font-bold leading-snug">{data.post.title}</h1>
		<p class="text-sm text-muted-foreground">{data.post.date} · {data.post.readMinutes} min read</p>
		<p class="max-w-[68ch] text-muted-foreground">{data.post.summary}</p>
	</header>

	{#if data.post.cover}
		<div class="figure">{@html data.post.cover}</div>
	{/if}

	<Tldr markdown={data.post.tldrMarkdown} skills={data.skills} technologies={data.technologies} />

	<Toc items={data.post.toc} />

	<MarkdownBlock
		class="prose-post"
		markdown={data.post.body}
		skills={data.skills}
		technologies={data.technologies}
	/>

	{#if data.post.references?.length}
		<References references={data.post.references} />
	{/if}
</article>
