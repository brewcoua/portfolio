<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export type InputProps = WithElementRef<HTMLInputAttributes>;
</script>

<script lang="ts">
	let { class: className, ref = $bindable(null), ...restProps }: InputProps = $props();
</script>

<input
	bind:this={ref}
	data-slot="input"
	class={cn(
		'border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 aria-invalid:border-destructive h-8 w-full border px-3 py-2 text-sm outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
/>
