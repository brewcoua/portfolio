<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ColoredEntityBadge from '$lib/components/ColoredEntityBadge.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { getTechnologyChipStyle } from '$lib/content/presentation';
	import type { Technology } from '$lib/content/types';

	let {
		technologies,
		selected = $bindable()
	}: {
		technologies: Technology[];
		selected: string;
	} = $props();

	let open = $state(false);

	function choose(value: string): void {
		selected = value;
		open = false;
	}

	function techById(id: string): Technology | undefined {
		return technologies.find((t) => t.id === id);
	}
</script>

<div class="space-y-2">
	<label class="text-xs uppercase tracking-wide text-muted-foreground" for="technology-filter-trigger">Technology</label>
	<Popover.Root bind:open>
		<Popover.Trigger
			id="technology-filter-trigger"
			class={cn(
				'flex h-10 w-full cursor-pointer items-center justify-between gap-2 border border-border bg-background px-3 text-sm outline-none transition-colors',
				'hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2'
			)}
		>
			{#if selected === 'all'}
				<span class="text-muted-foreground">All technologies</span>
			{:else}
				{@const current = techById(selected)}
				{#if current}
					<ColoredEntityBadge
						label={current.label}
						style={getTechnologyChipStyle(selected, technologies)}
						icon={current.icon}
						class="pointer-events-none py-0.5"
					/>
				{:else}
					<span class="truncate">{selected}</span>
				{/if}
			{/if}
			<ChevronDownIcon class="size-4 shrink-0 opacity-60" aria-hidden="true" />
		</Popover.Trigger>
		<Popover.Content align="start" class="max-h-[min(320px,calc(100vh-10rem))] w-[min(280px,calc(100vw-3rem))] gap-0.5 overflow-y-auto overscroll-contain p-1.5 font-sans">
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-none px-2 py-1 text-left text-sm transition-colors hover:bg-muted"
				onclick={() => choose('all')}
			>
				<span class="text-muted-foreground">All technologies</span>
			</button>
			{#each technologies as tech}
				<button
					type="button"
					class="flex w-full items-center rounded-none px-2 py-1 text-left transition-colors hover:bg-muted"
					onclick={() => choose(tech.id)}
				>
					<ColoredEntityBadge
						label={tech.label}
						style={getTechnologyChipStyle(tech.id, technologies)}
						icon={tech.icon}
						class="pointer-events-none py-0"
					/>
				</button>
			{/each}
		</Popover.Content>
	</Popover.Root>
</div>
