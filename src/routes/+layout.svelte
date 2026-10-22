<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import ThemeDocumentSync from '$lib/components/ThemeDocumentSync.svelte';

	let { children, data } = $props();

	const title = $derived(
		page.data.title ? `${page.data.title} · ${data.profile.name}` : data.site.defaultSeo.title
	);

	const isCurrent = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{title}</title>
	<meta name="description" content={data.site.defaultSeo.description} />
	<meta name="author" content={data.profile.name} />
	<meta name="keywords" content={data.site.defaultSeo.keywords.join(', ')} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.site.defaultSeo.description} />
	<meta property="og:image" content={`${data.site.baseUrl}${data.site.defaultSeo.image}`} />
	<meta property="og:url" content={data.site.baseUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={data.site.siteName} />
</svelte:head>

<ThemeDocumentSync />

<div class="mx-auto flex min-h-screen w-full max-w-[78ch] flex-col px-4 py-8 sm:px-6 sm:py-12">
	<header class="mb-12 space-y-3">
		<a class="block w-fit font-bold hover:text-primary" href="/">{data.profile.name.toLowerCase()}</a>
		<nav class="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Main">
			{#each data.site.navigation as item}
				{@const current = isCurrent(item.href)}
				<a
					href={item.href}
					class={current ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
					aria-current={current ? 'page' : undefined}
				>{current ? '>' : '\u00a0'}{item.label.toLowerCase()}</a>
			{/each}
		</nav>
	</header>

	<main class="flex-1">{@render children()}</main>

	<footer class="mt-20 space-y-4 border-t border-dashed pt-6 text-sm text-muted-foreground">
		<ul class="flex flex-wrap gap-x-5 gap-y-1">
			{#each data.profile.links as link}
				<li>
					<a class="link" href={link.url} target={link.type === 'email' ? undefined : '_blank'} rel="noreferrer">
						{link.type === 'email' ? link.url.replace(/^mailto:/, '') : link.type}
					</a>
				</li>
			{/each}
			{#if data.site.cvUrl}
				<li><a class="link" href={data.site.cvUrl} target="_blank" rel="noreferrer">cv.pdf</a></li>
			{/if}
		</ul>
		<ThemeSwitcher />
	</footer>
</div>
