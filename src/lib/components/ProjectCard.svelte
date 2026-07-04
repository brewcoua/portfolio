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
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { formatEntityDate } from '$lib/content/format';
	import ProjectStatusBadge from '$lib/components/ProjectStatusBadge.svelte';
	import RoleBadge from '$lib/components/RoleBadge.svelte';
	import { resolveLink } from '$lib/content/presentation';
	import { cn } from '$lib/utils';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { PROJECT_KIND_LABELS } from '$lib/content/types';
	import type { LinkItem, MarkdownInlineNode, Project, ProjectKind, Role, Skill, Technology } from '$lib/content/types';
	import type { Component } from 'svelte';

	let {
		project,
		technologies = [],
		skills = [],
		roles = [],
		showActions = true,
		matchHeight = false,
		maxVisibleTechnologies
	} = $props<{
		project: Project;
		technologies?: Technology[];
		skills?: Skill[];
		roles?: Role[];
		showActions?: boolean;
		matchHeight?: boolean;
		maxVisibleTechnologies?: number;
	}>();

	const kindLabel = $derived(
		project.kind ? PROJECT_KIND_LABELS[project.kind as ProjectKind] : null
	);
	const resolvedLinks = $derived(project.links.map((link: LinkItem) => resolveLink(link)));
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

	function abstractInline(): MarkdownInlineNode[] {
		const first = project.abstractMarkdown?.blocks[0];
		return first?.type === 'paragraph' ? first.children : [];
	}

	const visibleTechnologies = $derived(
		typeof maxVisibleTechnologies === 'number' && maxVisibleTechnologies > 0
			? project.technologies.slice(0, maxVisibleTechnologies)
			: project.technologies
	);
	const hiddenTechnologiesCount = $derived(
		typeof maxVisibleTechnologies === 'number' && maxVisibleTechnologies > 0
			? Math.max(0, project.technologies.length - maxVisibleTechnologies)
			: 0
	);
</script>

<Card.Root class={cn(matchHeight && 'flex h-full flex-col')}>
	{#if project.thumbnail}
		<img src={project.thumbnail} alt={project.title} class="h-40 w-full object-cover" />
	{/if}
	<Card.Header class="space-y-1">
		<Card.Title class="text-xl">
			<a class="hover:text-primary" href={`/projects/${project.slug}`}>{project.title}</a>
		</Card.Title>
		{#if project.subtitle}
			<Card.Description>{project.subtitle}</Card.Description>
		{/if}
		<div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			<RoleBadge roleId={project.role} {roles} />
			<span class="opacity-40" aria-hidden="true">•</span>
			<ProjectStatusBadge status={project.status} />
			{#if kindLabel}
				<span class="opacity-40" aria-hidden="true">•</span>
				<Badge variant="outline" class="px-2 py-0.5 text-xs">{kindLabel}</Badge>
			{/if}
			<span class="opacity-40" aria-hidden="true">•</span>
			<span>{formatEntityDate(project)}{#if project.duration} · {project.duration}{/if}</span>
		</div>
	</Card.Header>

	<Card.Content class={cn('flex flex-col gap-4', matchHeight && 'flex-1')}>
		<MarkdownInline markdown={abstractInline()} {skills} {technologies} class="text-sm" />
		<div class="mt-auto flex flex-wrap gap-2">
			{#each visibleTechnologies as tech}
				<TechBadge techId={tech} {technologies} {skills} />
			{/each}
			{#if hiddenTechnologiesCount > 0}
				<Badge variant="outline" class="px-2 py-1 text-xs text-muted-foreground">
					+{hiddenTechnologiesCount}
				</Badge>
			{/if}
		</div>
	</Card.Content>

	{#if showActions}
		<Card.Footer class="flex flex-wrap items-start justify-between gap-2">
			<div class="flex flex-wrap gap-2">
				{#each resolvedLinks.slice(0, 2) as link}
					{@const Icon = iconFor(link.icon)}
					<Button
						href={link.url}
						variant={link.type === 'github' ? 'default' : 'outline'}
						size="sm"
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}
					>
						<Icon />
						{link.label}
					</Button>
				{/each}
			</div>
			<Button href={`/projects/${project.slug}`} variant="ghost" size="sm">Details</Button>
		</Card.Footer>
	{/if}
</Card.Root>
