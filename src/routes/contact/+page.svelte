<script lang="ts">
	import BrandGlyph from '$lib/components/BrandGlyph.svelte';
	import MailIcon from '@lucide/svelte/icons/mail';

	let { data } = $props();

	const META: Record<string, { label: string; brand?: string; handle: (url: string) => string }> = {
		github: { label: 'GitHub', brand: 'github', handle: (url) => `@${url.replace(/\/$/, '').split('/').pop()}` },
		codeberg: { label: 'Codeberg', brand: 'codeberg', handle: (url) => `@${url.replace(/\/$/, '').split('/').pop()}` },
		gitlab: { label: 'GitLab', brand: 'gitlab', handle: (url) => `@${url.replace(/\/$/, '').split('/').pop()}` },
		linkedin: { label: 'LinkedIn', brand: 'linkedin', handle: (url) => url.replace(/^https?:\/\//, '').replace(/^[^/]*\//, '').replace(/\/$/, '') },
		email: { label: 'Email', handle: (url) => url.replace(/^mailto:/, '') }
	};

	const items = $derived(
		data.links.map((link) => {
			const meta = META[link.type];
			return {
				...link,
				label: meta?.label ?? link.label ?? link.type,
				brand: meta?.brand,
				handle: meta ? meta.handle(link.url) : link.url,
				external: link.type !== 'email'
			};
		})
	);
</script>

<section class="space-y-2">
	<h1 class="h-section text-xl">contact</h1>
	<p class="text-sm text-muted-foreground">
		Open to engineering roles, research collaborations, and interesting problems.
	</p>
</section>

<ul class="mt-8 space-y-2">
	{#each items as item}
		<li>
			<a
				href={item.url}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noreferrer' : undefined}
				class="group flex items-baseline gap-3 hover:text-primary"
			>
				{#if item.brand}
					<BrandGlyph slug={item.brand} size={14} class="size-3.5 shrink-0 self-center" />
				{:else}
					<MailIcon class="size-3.5 shrink-0 self-center" aria-hidden="true" />
				{/if}
				<span class="font-bold">{item.label.toLowerCase()}</span>
				<span class="leader" aria-hidden="true"></span>
				<span class="truncate text-sm text-muted-foreground group-hover:text-primary">{item.handle} ↗</span>
			</a>
		</li>
	{/each}
</ul>
