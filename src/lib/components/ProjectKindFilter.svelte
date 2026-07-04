<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Badge } from '$lib/components/ui/badge';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { PROJECT_KIND_LABELS, type ProjectKind } from '$lib/content/types';

	let {
		kinds,
		selected = $bindable()
	}: {
		kinds: readonly ProjectKind[] | ProjectKind[];
		selected: ProjectKind | 'all';
	} = $props();

	let open = $state(false);

	function choose(value: ProjectKind | 'all'): void {
		selected = value;
		open = false;
	}
</script>

<div class="space-y-2">
	<label class="text-xs uppercase tracking-wide text-muted-foreground" for="kind-filter-trigger">Type</label>
	<Popover.Root bind:open>
		<Popover.Trigger
			id="kind-filter-trigger"
			class={cn(
				'flex h-10 w-full cursor-pointer items-center justify-between gap-2 border border-border bg-background px-3 text-sm outline-none transition-colors',
				'hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2'
			)}
		>
			{#if selected === 'all'}
				<span class="text-muted-foreground">All types</span>
			{:else}
				<Badge variant="outline">{PROJECT_KIND_LABELS[selected]}</Badge>
			{/if}
			<ChevronDownIcon class="size-4 shrink-0 opacity-60" aria-hidden="true" />
		</Popover.Trigger>
		<Popover.Content align="start" class="w-[min(280px,calc(100vw-3rem))] gap-0.5 p-1.5 font-sans">
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-none px-2 py-1 text-left text-sm transition-colors hover:bg-muted"
				onclick={() => choose('all')}
			>
				<span class="text-muted-foreground">All types</span>
			</button>
			{#each kinds as kind}
				<button
					type="button"
					class="flex w-full items-center rounded-none px-2 py-1 text-left transition-colors hover:bg-muted"
					onclick={() => choose(kind)}
				>
					<Badge variant="outline">{PROJECT_KIND_LABELS[kind]}</Badge>
				</button>
			{/each}
		</Popover.Content>
	</Popover.Root>
</div>
