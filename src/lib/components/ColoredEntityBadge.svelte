<script lang="ts">
	import ContentLucideIcon from '$lib/components/ContentLucideIcon.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';

	let {
		label,
		style,
		icon,
		class: className = ''
	}: {
		label: string;
		style: string;
		icon?: string;
		class?: string;
	} = $props();
</script>

<Badge variant="outline" class={cn('gap-1 border font-medium px-2 py-1 text-xs', className)} {style}>
	<ContentLucideIcon name={icon} class="size-3.5 shrink-0 opacity-80" />
	{label}
</Badge>
