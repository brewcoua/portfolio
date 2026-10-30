<script lang="ts">
	import type { Reference } from '$lib/content/apa';

	let { reference }: { reference: Reference } = $props();
</script>

{reference.authors} ({reference.year}).
{#if reference.titleItalic}<em>{reference.title}</em>{:else}{reference.title}{/if}{#if reference.descriptor}{' '}{reference.descriptor}{/if}.
{#if reference.source}<em>{reference.source}</em>{reference.sourceDetails ?? ''}.{/if}
{#if reference.publisher}{reference.publisher}.{/if}
{#if reference.href}<a class="link break-all" href={reference.href} target="_blank" rel="noreferrer">{reference.href}</a>{/if}
