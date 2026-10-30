<script lang="ts">
	import type { TocItem } from '$lib/content/types';

	let { items }: { items: TocItem[] } = $props();
	let active = $state('');

	// The section whose heading last crossed the top 30% of the viewport is the one being read.
	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) active = entry.target.id;
			},
			{ rootMargin: '0px 0px -70% 0px' }
		);
		for (const item of items) {
			const heading = document.getElementById(item.id);
			if (heading) observer.observe(heading);
		}
		return () => observer.disconnect();
	});
</script>

{#if items.length}
	<nav aria-label="Contents" class="toc">
		<p class="mb-1 text-xs text-muted-foreground">contents</p>
		<ol class="space-y-0.5">
			{#each items as item (item.id)}
				<li>
					<a class="hover:text-primary" class:active={active === item.id} href={`#${item.id}`}>{item.text}</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}
