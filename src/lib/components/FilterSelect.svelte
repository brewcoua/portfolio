<script lang="ts">
	import { Select } from 'bits-ui';

	let {
		label,
		items,
		value = $bindable('all')
	}: {
		label: string;
		items: { value: string; label: string }[];
		value: string;
	} = $props();

	const options = $derived([{ value: 'all', label: 'all' }, ...items]);
	const current = $derived(options.find((o) => o.value === value)?.label ?? value);
</script>

<Select.Root type="single" bind:value items={options}>
	<Select.Trigger
		class="flex w-full cursor-pointer items-baseline gap-2 py-1 text-left text-sm hover:text-primary"
		aria-label={`Filter by ${label}`}
	>
		<span class="text-muted-foreground">{label}:</span>
		<span class={value === 'all' ? 'text-muted-foreground' : 'text-primary'}>{current.toLowerCase()}</span>
		<span class="ml-auto text-muted-foreground" aria-hidden="true">▾</span>
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			sideOffset={4}
			class="surface z-50 max-h-[min(320px,var(--bits-select-content-available-height))] w-[var(--bits-select-anchor-width)] min-w-48 overflow-y-auto p-1 text-sm"
		>
			<Select.Viewport>
				{#each options as option (option.value)}
					<Select.Item
						value={option.value}
						label={option.label}
						class="flex cursor-pointer gap-2 px-2 py-0.5 outline-none data-highlighted:bg-background data-highlighted:text-primary data-selected:text-primary"
					>
						{#snippet children({ selected })}
							<span class="w-3 shrink-0" aria-hidden="true">{selected ? '>' : ''}</span>
							{option.label.toLowerCase()}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
