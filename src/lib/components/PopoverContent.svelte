<script lang="ts">
	import { Popover } from 'bits-ui';
	import { cn } from '$lib/utils';

	let { class: className = '', ...rest }: Popover.ContentProps = $props();
</script>

<Popover.Portal>
	<Popover.Content
		sideOffset={6}
		class={cn('surface z-50 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2 p-3 text-xs outline-none', className)}
		{...rest}
	/>
</Popover.Portal>
