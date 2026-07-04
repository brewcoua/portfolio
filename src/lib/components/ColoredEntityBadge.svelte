<script lang="ts">
	import BrandGlyph from '$lib/components/BrandGlyph.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';

	let {
		label,
		style,
		icon,
		brandSlug,
		class: className = ''
	}: {
		label: string;
		style: string;
		/** Lucide fallback icon name (frontmatter `icon`). */
		icon?: string;
		/** Content slug/path to resolve a brand mark; falls back to `icon` then a tag. */
		brandSlug?: string;
		class?: string;
	} = $props();
</script>

<Badge variant="outline" class={cn('gap-1 border font-medium px-2 py-1 text-xs', className)} {style}>
	<BrandGlyph slug={brandSlug} {icon} size={14} class="size-3.5 shrink-0 opacity-80" />
	{label}
</Badge>
