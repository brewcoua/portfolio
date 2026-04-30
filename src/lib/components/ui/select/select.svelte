<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	export type SelectProps = WithElementRef<HTMLSelectAttributes>;
</script>

<script lang="ts">
	let { class: className, ref = $bindable(null), children, ...restProps }: SelectProps = $props();
</script>

<select
	bind:this={ref}
	data-slot="select"
	class={cn(
		'border-border bg-background ring-offset-background focus-visible:ring-ring/50 aria-invalid:border-destructive h-8 w-full border px-3 py-1 text-sm outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</select>
