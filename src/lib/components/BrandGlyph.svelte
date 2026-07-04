<script lang="ts">
	import { getBrandIcon } from '$lib/content/brand-icons';
	import ContentLucideIcon from './ContentLucideIcon.svelte';

	let {
		slug,
		icon,
		size = 20,
		brandColor = false,
		class: className = ''
	}: {
		/** Content slug or `type/slug` path used to look up a brand mark. */
		slug?: string;
		/** Lucide fallback icon name when no brand mark exists. */
		icon?: string;
		size?: number;
		/** Paint the mark in its brand color instead of currentColor. */
		brandColor?: boolean;
		class?: string;
	} = $props();

	const brand = $derived(getBrandIcon(slug));
</script>

{#if brand}
	<svg
		role="img"
		viewBox="0 0 24 24"
		width={size}
		height={size}
		class={className}
		fill={brandColor ? brand.hex : 'currentColor'}
		aria-hidden="true"
	>
		<title>{brand.title}</title>
		<path d={brand.path} />
	</svg>
{:else}
	<ContentLucideIcon name={icon} class={className} />
{/if}
