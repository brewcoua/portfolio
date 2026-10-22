<script lang="ts">
	import BrandGlyph from '$lib/components/BrandGlyph.svelte';
	import { cn } from '$lib/utils';

	let {
		label,
		icon,
		brandSlug,
		class: className = ''
	}: {
		label: string;
		/** Lucide fallback icon name (frontmatter `icon`). */
		icon?: string;
		/** Content slug/path to resolve a brand mark; falls back to `icon` then a tag. */
		brandSlug?: string;
		class?: string;
	} = $props();
</script>

<span class={cn('tag hover:text-foreground', className)}>
	<BrandGlyph slug={brandSlug} {icon} size={12} class="mr-1 size-3 shrink-0 opacity-80" />
	{label}
</span>
