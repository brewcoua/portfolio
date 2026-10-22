<script lang="ts">
	import ProjectStatusBadge from '$lib/components/ProjectStatusBadge.svelte';
	import RoleBadge from '$lib/components/RoleBadge.svelte';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { formatEntityDate, formatReferenceMeta } from '$lib/content/format';
	import { resolveLink } from '$lib/content/presentation';
	import { PROJECT_KIND_LABELS } from '$lib/content/types';

	let { data } = $props();

	const links = $derived(data.project.links.map((link) => resolveLink(link)));

	const relatedExperienceItems = $derived(
		data.relatedExperience.map((item) => ({
			label: `${item.title} - ${item.organizationShort ?? item.organization}`,
			href: `/experience/${item.slug}`,
			type: 'experience'
		}))
	);

	const relatedPublicationItems = $derived(
		data.relatedPublications.map((item) => ({
			label: item.title,
			href: `/publications/${item.slug}`,
			type: 'publication'
		}))
	);
</script>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm text-muted-foreground"># project</p>
		<h1 class="text-xl font-bold leading-snug">{data.project.title}</h1>
		{#if data.project.subtitle}
			<p class="text-muted-foreground">{data.project.subtitle}</p>
		{/if}
	</header>

	<div class="flex flex-wrap items-center gap-2 text-sm">
		<RoleBadge roleId={data.project.role} roles={data.roles} />
		<ProjectStatusBadge status={data.project.status} />
		{#if data.project.kind}
			<span class="tag">{PROJECT_KIND_LABELS[data.project.kind]}</span>
		{/if}
		<span class="tag">
			{formatEntityDate(data.project)}{#if data.project.duration}<span class="ml-1 text-muted-foreground">· {data.project.duration}</span>{/if}
		</span>
	</div>

	{#if data.project.thumbnail}
		<img
			src={data.project.thumbnail}
			alt={data.project.title}
			class="max-h-80 w-full border border-border object-cover"
		/>
	{/if}

	<MarkdownBlock
		markdown={data.project.abstractMarkdown}
		skills={data.skills}
		technologies={data.technologies}
	/>
	<MarkdownBlock
		markdown={data.project.descriptionMarkdown}
		skills={data.skills}
		technologies={data.technologies}
	/>

	<div class="space-y-8">
		<aside class="space-y-8">
			<section>
				<h2 class="h-section mb-3">Highlights</h2>
				<ul class="list-disc marker:text-muted-foreground space-y-2 pl-5">
					{#each data.project.highlights as highlight, highlightIndex}
						<li>
							<MarkdownInline
								markdown={data.project.highlightsMarkdown?.[highlightIndex]}
								skills={data.skills}
								technologies={data.technologies}
							/>
						</li>
					{/each}
				</ul>
			</section>

			<section>
				<h2 class="h-section mb-3">Technologies</h2>
				<div class="flex flex-wrap gap-x-2 gap-y-1">
					{#each data.project.technologies as tech}
						<TechBadge
							techId={tech}
							technologies={data.technologies}
							skills={data.skills}
						/>
					{/each}
				</div>
			</section>

			<section>
				<h2 class="h-section mb-3">Skills</h2>
				<div class="flex flex-wrap gap-x-2 gap-y-1">
					{#each data.project.skills as skillId}
						<SkillBadge
							skillId={skillId}
							skills={data.skills}
							technologies={data.technologies}
						/>
					{/each}
				</div>
			</section>

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

			{#if data.relatedPublications.length > 0}
				<RelationshipPanel title="Related Publication" items={relatedPublicationItems} />
			{/if}

			{#if data.relatedExperience.length > 0}
				<RelationshipPanel title="Related Experience" items={relatedExperienceItems} />
			{/if}

			{#if data.project.references?.length}
				<section>
					<h2 class="h-section mb-3">References</h2>
					<ol class="space-y-2.5 text-sm">
						{#each data.project.references as reference}
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
