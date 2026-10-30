<script lang="ts">
	import type { TocItem } from '$lib/content/types';

	let { items }: { items: TocItem[] } = $props();
	let active = $state('');

	// The section being read is the last one whose heading sits above 30% of the viewport.
	// Measured on scroll rather than with an IntersectionObserver, which misses headings skipped by a fast jump.
	$effect(() => {
		const update = () => {
			const line = window.innerHeight * 0.3;
			active = '';
			for (const item of items) {
				const heading = document.getElementById(item.id);
				if (heading && heading.getBoundingClientRect().top <= line) active = item.id;
			}
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		return () => window.removeEventListener('scroll', update);
	});
</script>

{#snippet list(label: string, cls: string)}
	<nav aria-label={label} class={cls}>
		<p class="mb-1 text-xs text-muted-foreground">contents</p>
		<ol class="space-y-0.5">
			{#each items as item (item.id)}
				<li>
					<a class="hover:text-primary" class:active={active === item.id} href={`#${item.id}`}>{item.text}</a>
				</li>
			{/each}
		</ol>
	</nav>
{/snippet}

{#if items.length}
	{@render list('Contents', 'toc')}
	{@render list('Contents, pinned', 'toc toc-pinned')}
{/if}
