<script lang="ts">
	import type { Reference } from '$lib/content/apa';
	import ReferenceEntry from './ReferenceEntry.svelte';

	let { references }: { references: Reference[] } = $props();
</script>

<section>
	<h2 class="h-section mb-3">References</h2>
	<ul class="space-y-2.5 text-sm">
		{#each references as reference (reference.key)}
			<li id={`ref-${reference.key}`} class="reference scroll-mt-24 pl-8 -indent-8 leading-snug">
				<ReferenceEntry {reference} />
			</li>
		{/each}
	</ul>
</section>
