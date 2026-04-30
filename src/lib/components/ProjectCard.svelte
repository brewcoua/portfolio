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
	import * as Card from '$lib/components/ui/card';
	import { formatEntityDate } from '$lib/content/format';
	import ProjectStatusBadge from '$lib/components/ProjectStatusBadge.svelte';
	import RoleBadge from '$lib/components/RoleBadge.svelte';
	import { resolveLink } from '$lib/content/presentation';
	import { cn } from '$lib/utils';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import type { LinkItem, Project, Role, Skill, Technology } from '$lib/content/types';
	import type { Component } from 'svelte';

	let { project, technologies = [], skills = [], roles = [], showActions = true, matchHeight = false } = $props<{
		project: Project;
		technologies?: Technology[];
		skills?: Skill[];
		roles?: Role[];
		showActions?: boolean;
		matchHeight?: boolean;
	}>();

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
			<span class="opacity-40" aria-hidden="true">•</span>
			<span>{formatEntityDate(project)}</span>
		</div>
	</Card.Header>

	<Card.Content class={cn('flex flex-col gap-4', matchHeight && 'flex-1')}>
		<p class="text-sm">{project.abstract}</p>
		<div class="mt-auto flex flex-wrap gap-2">
			{#each project.technologies as tech}
				<TechBadge techId={tech} {technologies} {skills} />
			{/each}
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
