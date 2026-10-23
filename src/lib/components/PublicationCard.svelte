<script lang="ts">
	import { formatEntityDate } from '$lib/content/format';
	import { resolveLink } from '$lib/content/presentation';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { PUBLICATION_KIND_LABELS } from '$lib/content/types';
	import type {
		LinkItem,
		MarkdownInlineNode,
		Publication,
		PublicationKind,
		Skill,
		Technology
	} from '$lib/content/types';

	let {
		publication,
		technologies = [],
		skills = [],
		maxVisibleTechnologies
	} = $props<{
		publication: Publication;
		technologies?: Technology[];
		skills?: Skill[];
		maxVisibleTechnologies?: number;
	}>();

	const kindLabel = $derived(
		publication.kind ? PUBLICATION_KIND_LABELS[publication.kind as PublicationKind] : null
	);
	const authorLine = $derived(
		publication.authors.length > 3
			? `${publication.authors.slice(0, 3).join(', ')} et al.`
			: publication.authors.join(', ')
	);
	const resolvedLinks = $derived(publication.links.map((link: LinkItem) => resolveLink(link)));

	function abstractInline(): MarkdownInlineNode[] {
		const first = publication.abstractMarkdown?.blocks[0];
		return first?.type === 'paragraph' ? first.children : [];
	}

	const visibleTechnologies = $derived(
		typeof maxVisibleTechnologies === 'number' && maxVisibleTechnologies > 0
			? publication.technologies.slice(0, maxVisibleTechnologies)
			: publication.technologies
	);
	const hiddenTechnologiesCount = $derived(publication.technologies.length - visibleTechnologies.length);
</script>

<article class="space-y-1.5">
	<header class="flex items-baseline gap-3">
		<a class="font-bold hover:text-primary" href={`/publications/${publication.slug}`}>{publication.title}</a>
		<span class="leader" aria-hidden="true"></span>
		<span class="shrink-0 text-sm text-muted-foreground">{formatEntityDate(publication)}</span>
	</header>
	{#if publication.subtitle}
		<p class="text-sm text-muted-foreground">{publication.subtitle}</p>
	{/if}
	<p class="text-sm text-muted-foreground">
		{authorLine}{#if publication.venue}<span>{' — '}{publication.venue}</span>{/if}
	</p>
	<MarkdownInline markdown={abstractInline()} {skills} {technologies} class="block text-sm" />
	{#if visibleTechnologies.length > 0}
		<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
			{#each visibleTechnologies as tech}
				<TechBadge techId={tech} {technologies} {skills} />
			{/each}
			{#if hiddenTechnologiesCount > 0}
				<span class="tag">+{hiddenTechnologiesCount}</span>
			{/if}
		</div>
	{/if}
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
		{#if kindLabel}
			<span class="meta lowercase" data-sigil="#">{kindLabel}</span>
		{/if}
		{#each resolvedLinks.slice(0, 2) as link}
			<a
				class="link"
				href={link.url}
				target={link.external ? '_blank' : undefined}
				rel={link.external ? 'noreferrer' : undefined}
			>{link.label.toLowerCase()} ↗</a>
		{/each}
	</div>
</article>
