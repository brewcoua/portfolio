<script lang="ts">
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';

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

	{#if data.post.toc.length}
		<nav aria-label="Contents" class="post-toc">
			<p class="mb-1 text-xs text-muted-foreground">contents</p>
			<ol class="space-y-0.5">
				{#each data.post.toc as item}
					<li><a class="hover:text-primary" href={`#${item.id}`}>{item.text}</a></li>
				{/each}
			</ol>
		</nav>
	{/if}

	<MarkdownBlock
		class="prose-post"
		markdown={data.post.body}
		skills={data.skills}
		technologies={data.technologies}
	/>
</article>
