<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import logoRaw from '$lib/assets/logo.svg?raw';
	import { page } from '$app/state';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { Separator } from '$lib/components/ui/separator';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import ThemeDocumentSync from '$lib/components/ThemeDocumentSync.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{data.site.defaultSeo.title}</title>
	<meta name="description" content={data.site.defaultSeo.description} />
	<meta name="author" content={data.profile.name} />
	<meta name="keywords" content={data.site.defaultSeo.keywords.join(', ')} />
	<meta property="og:title" content={data.site.defaultSeo.title} />
	<meta property="og:description" content={data.site.defaultSeo.description} />
	<meta property="og:image" content={`${data.site.baseUrl}${data.site.defaultSeo.image}`} />
	<meta property="og:url" content={data.site.baseUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={data.site.siteName} />
</svelte:head>

<ThemeDocumentSync />

<div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
	<header class="mb-7 pb-2">
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
			<a class="flex items-center gap-2 text-xl font-semibold tracking-tight" href="/">
				<span class="inline-block shrink-0" style="height:1.2em;aspect-ratio:100/150;" aria-hidden="true">{@html logoRaw}</span>
				{data.profile.name}
			</a>
			<div class="flex flex-wrap items-center justify-end gap-3">
				<p class="text-sm text-muted-foreground">{data.profile.location}</p>
				<ThemeSwitcher />
			</div>
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
		<Separator class="mt-4" />
	</header>

	<main class="flex-1">{@render children()}</main>

	<footer class="mt-16 pt-6 text-sm text-muted-foreground">
		<Separator class="mb-6" />
		<p>{data.site.siteName}</p>
	</footer>
</div>
