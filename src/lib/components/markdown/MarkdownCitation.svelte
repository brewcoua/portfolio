<script lang="ts">
	import { Popover } from 'bits-ui';
	import PopoverContent from '$lib/components/PopoverContent.svelte';
	import ReferenceEntry from '$lib/components/ReferenceEntry.svelte';
	import type { Reference } from '$lib/content/apa';

	let { label, items, trailing }: { label: string; items: Reference[]; trailing?: string } = $props();
</script>

<span class="whitespace-nowrap"><Popover.Root>
	<Popover.Trigger class="m-0 inline cursor-pointer border-0 bg-transparent p-0 text-inherit"
		><span class="citation">{label}</span></Popover.Trigger
	><PopoverContent class="w-96">
		{#each items as reference (reference.key)}
			<p class="leading-snug"><ReferenceEntry {reference} /></p>
		{/each}
		<a class="link self-start text-muted-foreground" href={`#ref-${items[0].key}`}>in references ↓</a>
	</PopoverContent>
</Popover.Root>{trailing}</span>
