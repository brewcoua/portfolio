<script lang="ts">
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';

	let { data } = $props();
</script>

<!-- Shared by every figure's `.wobble` strokes. -->
<svg width="0" height="0" class="absolute" aria-hidden="true">
	<filter id="scribble">
		<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" />
		<feDisplacementMap in="SourceGraphic" scale="3" />
	</filter>
</svg>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm text-muted-foreground"># post</p>
		<h1 class="text-xl font-bold leading-snug">{data.post.title}</h1>
		<p class="text-sm text-muted-foreground">{data.post.date}</p>
	</header>

	<MarkdownBlock markdown={data.post.body} skills={data.skills} technologies={data.technologies} />
</article>
