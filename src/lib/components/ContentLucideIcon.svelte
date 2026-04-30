<script lang="ts">
	import type { Component } from 'svelte';
	import { resolveContentIcon } from '$lib/content/content-icons';

	let {
		name,
		class: className = 'size-3.5 shrink-0 opacity-80'
	}: {
		name?: string;
		class?: string;
	} = $props();

	const Icon = $derived(resolveContentIcon(name));
</script>

<Icon class={className} aria-hidden="true" />
