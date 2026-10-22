<script lang="ts">
	import { formatEntityDate } from '$lib/content/format';
	import ProjectStatusBadge from '$lib/components/ProjectStatusBadge.svelte';
	import RoleBadge from '$lib/components/RoleBadge.svelte';
	import { resolveLink } from '$lib/content/presentation';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { PROJECT_KIND_LABELS } from '$lib/content/types';
	import type { LinkItem, MarkdownInlineNode, Project, ProjectKind, Role, Skill, Technology } from '$lib/content/types';

	let {
		project,
		technologies = [],
		skills = [],
		roles = [],
		maxVisibleTechnologies
	} = $props<{
		project: Project;
		technologies?: Technology[];
		skills?: Skill[];
		roles?: Role[];
		maxVisibleTechnologies?: number;
	}>();

	const kindLabel = $derived(
		project.kind ? PROJECT_KIND_LABELS[project.kind as ProjectKind] : null
	);
	const resolvedLinks = $derived(project.links.map((link: LinkItem) => resolveLink(link)));

	function abstractInline(): MarkdownInlineNode[] {
		const first = project.abstractMarkdown?.blocks[0];
		return first?.type === 'paragraph' ? first.children : [];
	}

	const visibleTechnologies = $derived(
		typeof maxVisibleTechnologies === 'number' && maxVisibleTechnologies > 0
			? project.technologies.slice(0, maxVisibleTechnologies)
			: project.technologies
	);
	const hiddenTechnologiesCount = $derived(project.technologies.length - visibleTechnologies.length);
</script>

<article class="space-y-1.5">
	<header class="flex items-baseline gap-3">
		<a class="font-bold hover:text-primary" href={`/projects/${project.slug}`}>{project.title}</a>
		<span class="leader" aria-hidden="true"></span>
		<span class="shrink-0 text-sm text-muted-foreground">{formatEntityDate(project)}</span>
	</header>
	{#if project.subtitle}
		<p class="text-sm text-muted-foreground">{project.subtitle}</p>
	{/if}
	<MarkdownInline markdown={abstractInline()} {skills} {technologies} class="block text-sm" />
	<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
		{#each visibleTechnologies as tech}
			<TechBadge techId={tech} {technologies} {skills} />
		{/each}
		{#if hiddenTechnologiesCount > 0}
			<span class="tag">+{hiddenTechnologiesCount}</span>
		{/if}
	</div>
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
		<RoleBadge roleId={project.role} {roles} />
		<ProjectStatusBadge status={project.status} />
		{#if kindLabel}
			<span class="tag lowercase">{kindLabel}</span>
		{/if}
		{#if project.duration}
			<span class="tag">{project.duration}</span>
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
