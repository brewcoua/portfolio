<script lang="ts">
	import { Dialog } from 'bits-ui';
	import GraphHero from '$lib/components/GraphHero.svelte';
	import type { GraphData } from '$lib/content/types';

	let { data }: { data: GraphData } = $props();

	let open = $state(false);

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'g' || e.metaKey || e.ctrlKey || e.altKey || open) return;
		const target = e.target as HTMLElement;
		if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
		e.preventDefault();
		open = true;
	}
</script>

<svelte:window onkeydown={onKeydown} />

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="group block w-full max-w-64 cursor-pointer border border-dashed text-left hover:border-primary md:max-w-none"
		aria-label="Open the interactive graph (shortcut: g)"
	>
		<GraphHero {data} compact />
		<span class="flex justify-between border-t border-dashed px-2 py-1 text-xs text-muted-foreground group-hover:text-primary">
			<span>graph.open()</span>
			<kbd>g</kbd>
		</span>
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-background/80" />
		<Dialog.Content
			class="surface fixed inset-2 z-50 flex flex-col outline-none sm:inset-6"
		>
			<header class="flex items-baseline justify-between gap-4 border-b border-dashed px-4 py-2 text-sm">
				<Dialog.Title class="font-bold">graph</Dialog.Title>
				<Dialog.Description class="hidden text-muted-foreground sm:block">
					hover to trace links · click to open · drag, scroll to zoom
				</Dialog.Description>
				<Dialog.Close class="cursor-pointer text-muted-foreground hover:text-primary">[esc] close</Dialog.Close>
			</header>
			<div class="min-h-0 flex-1">
				<GraphHero {data} />
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
