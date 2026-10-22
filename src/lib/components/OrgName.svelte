<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		name,
		short,
		formerly,
		href,
		class: className = ''
	}: { name: string; short?: string; formerly?: string; href?: string; class?: string } = $props();

	const external = $derived(href ? /^(https?:|mailto:)/.test(href) : false);
	const full = $derived(
		(short ? `${name} (${short})` : name) + (formerly ? `, formerly ${formerly}` : '')
	);
</script>

{#snippet label()}
	<span class="truncate">{name}</span>
	{#if short}<span class="shrink-0">&nbsp;({short})</span>{/if}
{/snippet}

<!-- The long name truncates; the short form stays visible and the tooltip carries the rest. -->
<Tooltip.Provider delayDuration={150}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{#if href}
					<a
						{...props}
						type={undefined}
						class={cn('link inline-flex min-w-0 max-w-full', className)}
						{href}
						target={external ? '_blank' : undefined}
						rel={external ? 'noopener noreferrer' : undefined}>{@render label()}</a
					>
				{:else}
					<button {...props} type="button" class={cn('inline-flex min-w-0 max-w-full cursor-default', className)}
						>{@render label()}</button
					>
				{/if}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				sideOffset={6}
				class="surface z-50 max-w-[calc(100vw-2rem)] px-2 py-1 text-xs">{full}</Tooltip.Content
			>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
