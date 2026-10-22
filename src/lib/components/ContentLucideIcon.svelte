<script lang="ts">
	import type { Component } from 'svelte';
	import { resolveContentIcon } from '$lib/content/content-icons';

	let {
		name,
		class: className = 'size-3.5 shrink-0 opacity-80',
		style
	}: {
		name?: string;
		class?: string;
		style?: string;
	} = $props();

	const Icon = $derived(resolveContentIcon(name));
</script>

<Icon class={className} {style} aria-hidden="true" />
