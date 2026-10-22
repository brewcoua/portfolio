<script lang="ts">
	import BrandGlyph from '$lib/components/BrandGlyph.svelte';
	import { cn } from '$lib/utils';

	let {
		label,
		icon,
		brandSlug,
		color,
		kind = 'tech',
		class: className = ''
	}: {
		label: string;
		/** Lucide fallback icon name (frontmatter `icon`). */
		icon?: string;
		/** Content slug/path to resolve a brand mark; falls back to `icon` then a tag. */
		brandSlug?: string;
		/** Entity hex color; tints the glyph only. */
		color?: string;
		kind?: 'tech' | 'skill';
		class?: string;
	} = $props();
</script>

<span class={cn('tag hover:text-foreground', kind === 'skill' && 'tag-skill', className)}>
	<BrandGlyph
		slug={brandSlug}
		{icon}
		size={12}
		class={cn('mr-1 size-3 shrink-0', color && 'tint')}
		style={color ? `--c: ${color}` : undefined}
	/>
	{label}
</span>
