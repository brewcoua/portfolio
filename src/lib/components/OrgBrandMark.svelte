<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		logo,
		label,
		website,
		size = 'md',
		class: className = ''
	} = $props<{
		logo?: string;
		label: string;
		website?: string;
		size?: 'sm' | 'md';
		class?: string;
	}>();

	const boxSize = $derived(size === 'sm' ? 'h-10 w-10' : 'h-12 w-12');

	const external = $derived(website ? /^(https?:|mailto:)/.test(website) : false);
</script>

{#if logo}
	{#if website}
		<a
			href={website}
			class={cn(
				'flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/30 text-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				boxSize,
				className
			)}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			aria-label={`${label} website`}
		>
			<img
				src={logo}
				alt=""
				class="max-h-full max-w-full object-contain object-center"
				loading="lazy"
				decoding="async"
			/>
		</a>
	{:else}
		<div
			class={cn(
				'flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/30',
				boxSize,
				className
			)}
		>
			<img
				src={logo}
				alt={label}
				class="max-h-full max-w-full object-contain object-center"
				loading="lazy"
				decoding="async"
			/>
		</div>
	{/if}
{/if}
