<script lang="ts">
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import LinkIcon from '@lucide/svelte/icons/link';
	import MailIcon from '@lucide/svelte/icons/mail';
	import NewspaperIcon from '@lucide/svelte/icons/newspaper';
	import PackageIcon from '@lucide/svelte/icons/package';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import RadioIcon from '@lucide/svelte/icons/radio';
	import VideoIcon from '@lucide/svelte/icons/video';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatEntityDate, formatReferenceMeta } from '$lib/content/format';
	import { resolveLink } from '$lib/content/presentation';
	import { PUBLICATION_KIND_LABELS } from '$lib/content/types';
	import type { Component } from 'svelte';

	let { data } = $props();

	const links = $derived(data.publication.links.map((link) => resolveLink(link)));

	const relatedProjectItems = $derived(
		data.relatedProjects.map((item) => ({
			label: item.title,
			href: `/projects/${item.slug}`,
			type: 'project'
		}))
	);

	const iconByName: Record<string, Component> = {
		github: LinkIcon,
		'external-link': ExternalLinkIcon,
		'book-open': BookOpenIcon,
		'file-text': FileTextIcon,
		newspaper: NewspaperIcon,
		video: VideoIcon,
		package: PackageIcon,
		radio: RadioIcon,
		palette: PaletteIcon,
		linkedin: LinkIcon,
		mail: MailIcon,
		link: LinkIcon
	};

	function iconFor(name: string): Component {
		return iconByName[name] ?? LinkIcon;
	}
</script>

<svelte:head>
	<title>{data.publication.title}</title>
</svelte:head>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Publication</p>
		<h1 class="text-4xl font-semibold tracking-tight">{data.publication.title}</h1>
		{#if data.publication.subtitle}
			<p class="text-muted-foreground">{data.publication.subtitle}</p>
		{/if}
		<p class="text-sm text-muted-foreground">{data.publication.authors.join(', ')}</p>
	</header>

	<div class="flex flex-wrap items-center gap-2 text-sm">
		{#if data.publication.kind}
			<Badge variant="outline">{PUBLICATION_KIND_LABELS[data.publication.kind]}</Badge>
		{/if}
		{#if data.publication.venue}
			<Badge variant="outline">{data.publication.venue}</Badge>
		{/if}
		<Badge variant="outline">{formatEntityDate(data.publication)}</Badge>
		{#if data.publication.doi}
			<a
				href={`https://doi.org/${data.publication.doi}`}
				target="_blank"
				rel="noreferrer"
				class="text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
			>DOI ↗</a>
		{/if}
	</div>

	<MarkdownBlock
		markdown={data.publication.abstractMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		class="max-w-3xl leading-7 lg:hidden"
	/>
	<MarkdownBlock
		markdown={data.publication.descriptionMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		class="max-w-3xl leading-7 lg:hidden"
	/>

	<div class="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start lg:gap-10">
		<aside class="space-y-6 lg:order-2 lg:sticky lg:top-24">
			{#if data.publication.highlights.length > 0}
				<section>
					<h2 class="mb-3 text-2xl font-semibold">Highlights</h2>
					<ul class="list-disc space-y-2 pl-5">
						{#each data.publication.highlights as highlight, highlightIndex}
							<li>
								<MarkdownInline
									markdown={data.publication.highlightsMarkdown?.[highlightIndex]}
									skills={data.skills}
									technologies={data.technologies}
								/>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if data.publication.technologies.length > 0}
				<section>
					<h2 class="mb-3 text-2xl font-semibold">Technologies</h2>
					<div class="flex flex-wrap gap-2">
						{#each data.publication.technologies as tech}
							<TechBadge
								techId={tech}
								technologies={data.technologies}
								skills={data.skills}
								class="px-3 py-1 text-sm"
							/>
						{/each}
					</div>
				</section>
			{/if}

			{#if data.publication.skills.length > 0}
				<section>
					<h2 class="mb-3 text-2xl font-semibold">Skills</h2>
					<div class="flex flex-wrap gap-2">
						{#each data.publication.skills as skillId}
							<SkillBadge
								skillId={skillId}
								skills={data.skills}
								technologies={data.technologies}
								class="px-3 py-1 text-sm"
							/>
						{/each}
					</div>
				</section>
			{/if}

			{#if links.length > 0}
				<section>
					<h2 class="mb-3 text-2xl font-semibold">Links</h2>
					<div class="flex flex-wrap gap-2">
						{#each links as link}
							{@const Icon = iconFor(link.icon)}
							<Button
								href={link.url}
								variant={link.type === 'paper' ? 'default' : 'outline'}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noreferrer' : undefined}
							>
								<Icon />
								{link.label}
							</Button>
						{/each}
					</div>
				</section>
			{/if}
		</aside>

		<div class="mt-6 space-y-6 lg:order-1 lg:mt-0">
			<div class="hidden space-y-6 lg:block">
				<MarkdownBlock
					markdown={data.publication.abstractMarkdown}
					skills={data.skills}
					technologies={data.technologies}
					class="leading-7"
				/>
				<MarkdownBlock
					markdown={data.publication.descriptionMarkdown}
					skills={data.skills}
					technologies={data.technologies}
					class="leading-7"
				/>
			</div>

			{#if data.relatedProjects.length > 0}
				<RelationshipPanel title="Companion Project" items={relatedProjectItems} />
			{/if}

			{#if data.publication.references?.length}
				<section>
					<h2 class="mb-3 text-lg font-semibold">References</h2>
					<ol class="space-y-2.5 text-sm">
						{#each data.publication.references as reference}
							<li class="flex gap-2 leading-snug">
								<span class="mt-px shrink-0 text-muted-foreground">[{reference.year}]</span>
								<span class="min-w-0">
									{#if reference.url}
										<a
											href={reference.url}
											target="_blank"
											rel="noreferrer"
											class="font-medium underline-offset-2 hover:text-primary hover:underline"
										>{reference.title}</a>
									{:else}
										<span class="font-medium">{reference.title}</span>
									{/if}
									<span class="text-muted-foreground"> — {formatReferenceMeta(reference)}</span>
									{#if reference.doi}
										<a
											href={`https://doi.org/${reference.doi}`}
											target="_blank"
											rel="noreferrer"
											class="ml-1 whitespace-nowrap text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
										>DOI ↗</a>
									{/if}
								</span>
							</li>
						{/each}
					</ol>
				</section>
			{/if}
		</div>
	</div>
</article>
