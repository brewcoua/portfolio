<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { Separator } from '$lib/components/ui/separator';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{data.site.defaultSeo.title}</title>
	<meta name="description" content={data.site.defaultSeo.description} />
</svelte:head>

<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
	<header class="mb-12 pb-6">
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
			<a class="text-xl font-semibold tracking-tight" href="/">{data.profile.name}</a>
			<p class="text-sm text-muted-foreground">{data.profile.location}</p>
		</div>
		<NavigationMenu.Root viewport={false}>
			<NavigationMenu.List class="flex flex-wrap gap-x-2 gap-y-2">
				{#each data.site.navigation as item}
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href={item.href}
							class={`text-sm ${page.url.pathname === item.href ? 'text-primary' : ''}`}
						>
							{item.label}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>
		<Separator class="mt-6" />
	</header>

	<main class="flex-1">{@render children()}</main>

	<footer class="mt-16 pt-6 text-sm text-muted-foreground">
		<Separator class="mb-6" />
		<p>{data.site.siteName}</p>
	</footer>
</div>
