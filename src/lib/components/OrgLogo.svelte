<script lang="ts">
	import { cn } from '$lib/utils';

	let { src, size = 16, class: className = '' }: { src?: string; size?: number; class?: string } = $props();
</script>

{#if src}
	<img {src} alt="" width={size} height={size} loading="lazy" decoding="async" class={cn('org-logo', className)} />
{/if}
