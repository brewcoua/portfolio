<script lang="ts">
	import BrandGlyph from '$lib/components/BrandGlyph.svelte';
	import MailIcon from '@lucide/svelte/icons/mail';
	import LinkIcon from '@lucide/svelte/icons/link';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import type { Component } from 'svelte';

	let { data } = $props();

	const META: Record<string, { label: string; icon?: Component; brand?: string; handle: (url: string) => string }> = {
		github: { label: 'GitHub', brand: 'github', handle: (url) => `@${url.replace(/\/$/, '').split('/').pop()}` },
		linkedin: { label: 'LinkedIn', brand: 'linkedin', handle: (url) => url.replace(/^https?:\/\//, '').replace(/^[^/]*\//, '').replace(/\/$/, '') },
		email: { label: 'Email', icon: MailIcon, handle: (url) => url.replace(/^mailto:/, '') }
	};

	const items = $derived(
		data.links.map((link) => {
			const meta = META[link.type];
			return {
				...link,
				label: meta?.label ?? link.label ?? link.type,
				icon: meta?.icon,
				brand: meta?.brand,
				handle: meta ? meta.handle(link.url) : link.url,
				external: link.type !== 'email'
			};
		})
	);
</script>

<section class="space-y-3">
	<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
	<h1 class="text-4xl font-semibold tracking-tight">Let's talk</h1>
	<p class="max-w-xl text-muted-foreground">
		Open to engineering roles, research collaborations, and interesting problems. Reach me through any of
		these channels.
	</p>
</section>

<ul class="mt-10 max-w-xl space-y-3">
	{#each items as item}
		<li>
			<a
				href={item.url}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noreferrer' : undefined}
				class="group flex items-center gap-4 border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
			>
				<span
					class="flex size-11 shrink-0 items-center justify-center border border-border bg-background text-foreground transition-colors group-hover:border-primary group-hover:text-primary"
				>
					{#if item.brand}
						<BrandGlyph slug={item.brand} size={20} />
					{:else if item.icon}
						{@const Icon = item.icon}
						<Icon class="size-5" aria-hidden="true" />
					{:else}
						<LinkIcon class="size-5" aria-hidden="true" />
					{/if}
				</span>
				<span class="min-w-0 flex-1">
					<span class="block text-sm font-medium">{item.label}</span>
					<span class="block truncate text-sm text-muted-foreground">{item.handle}</span>
				</span>
				<ArrowUpRightIcon
					class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
					aria-hidden="true"
				/>
			</a>
		</li>
	{/each}
</ul>
