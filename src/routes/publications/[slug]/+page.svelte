<script lang="ts">
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { formatEntityDate, formatReferenceMeta } from '$lib/content/format';
	import { resolveLink } from '$lib/content/presentation';
	import { PUBLICATION_KIND_LABELS } from '$lib/content/types';

	let { data } = $props();

	const links = $derived(data.publication.links.map((link) => resolveLink(link)));

	const relatedProjectItems = $derived(
		data.relatedProjects.map((item) => ({
			label: item.title,
			href: `/projects/${item.slug}`,
			type: 'project'
		}))
	);
</script>

<svelte:head>
	<title>{data.publication.title}</title>
</svelte:head>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm text-muted-foreground"># publication</p>
		<h1 class="text-xl font-bold leading-snug">{data.publication.title}</h1>
		{#if data.publication.subtitle}
			<p class="text-muted-foreground">{data.publication.subtitle}</p>
		{/if}
		<p class="text-sm text-muted-foreground">{data.publication.authors.join(', ')}</p>
	</header>

	<div class="flex flex-wrap items-center gap-2 text-sm">
		{#if data.publication.kind}
			<span class="tag">{PUBLICATION_KIND_LABELS[data.publication.kind]}</span>
		{/if}
		{#if data.publication.venue}
			<span class="tag">{data.publication.venue}</span>
		{/if}
		<span class="tag">{formatEntityDate(data.publication)}</span>
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
	/>
	<MarkdownBlock
		markdown={data.publication.descriptionMarkdown}
		skills={data.skills}
		technologies={data.technologies}
	/>

	<div class="space-y-8">
		<aside class="space-y-8">
			{#if data.publication.highlights.length > 0}
				<section>
					<h2 class="h-section mb-3">Highlights</h2>
					<ul class="list-disc marker:text-muted-foreground space-y-2 pl-5">
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
					<h2 class="h-section mb-3">Technologies</h2>
					<div class="flex flex-wrap gap-x-2 gap-y-1">
						{#each data.publication.technologies as tech}
							<TechBadge
								techId={tech}
								technologies={data.technologies}
								skills={data.skills}
							/>
						{/each}
					</div>
				</section>
			{/if}

			{#if data.publication.skills.length > 0}
				<section>
					<h2 class="h-section mb-3">Skills</h2>
					<div class="flex flex-wrap gap-x-2 gap-y-1">
						{#each data.publication.skills as skillId}
							<SkillBadge
								skillId={skillId}
								skills={data.skills}
								technologies={data.technologies}
							/>
						{/each}
					</div>
				</section>
			{/if}

			{#if links.length > 0}
				<section>
					<h2 class="h-section mb-3">Links</h2>
					<div class="flex flex-wrap gap-x-2 gap-y-1">
						{#each links as link}
							<a
								class="btn"
								href={link.url}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noreferrer' : undefined}
							>{link.label.toLowerCase()} ↗</a>
						{/each}
					</div>
				</section>
			{/if}
		</aside>

		<div class="space-y-8">

			{#if data.relatedProjects.length > 0}
				<RelationshipPanel title="Companion Project" items={relatedProjectItems} />
			{/if}

			{#if data.publication.references?.length}
				<section>
					<h2 class="h-section mb-3">References</h2>
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
