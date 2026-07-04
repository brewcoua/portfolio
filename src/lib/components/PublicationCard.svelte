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
	import { resolveLink } from '$lib/content/presentation';
	import { cn } from '$lib/utils';
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
	import type { Component } from 'svelte';

	let {
		publication,
		technologies = [],
		skills = [],
		showActions = true,
		matchHeight = false,
		maxVisibleTechnologies
	} = $props<{
		publication: Publication;
		technologies?: Technology[];
		skills?: Skill[];
		showActions?: boolean;
		matchHeight?: boolean;
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
		const first = publication.abstractMarkdown?.blocks[0];
		return first?.type === 'paragraph' ? first.children : [];
	}

	const visibleTechnologies = $derived(
		typeof maxVisibleTechnologies === 'number' && maxVisibleTechnologies > 0
			? publication.technologies.slice(0, maxVisibleTechnologies)
			: publication.technologies
	);
	const hiddenTechnologiesCount = $derived(
		typeof maxVisibleTechnologies === 'number' && maxVisibleTechnologies > 0
			? Math.max(0, publication.technologies.length - maxVisibleTechnologies)
			: 0
	);
</script>

<Card.Root class={cn(matchHeight && 'flex h-full flex-col')}>
	<Card.Header class="space-y-1">
		<Card.Title class="flex items-start gap-2 text-xl">
			<FileTextIcon class="mt-1 size-4 shrink-0 text-muted-foreground" />
			<a class="hover:text-primary" href={`/publications/${publication.slug}`}>{publication.title}</a>
		</Card.Title>
		{#if publication.subtitle}
			<Card.Description>{publication.subtitle}</Card.Description>
		{/if}
		<p class="text-xs text-muted-foreground">{authorLine}</p>
		<div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			{#if kindLabel}
				<Badge variant="outline" class="px-2 py-0.5 text-xs">{kindLabel}</Badge>
				<span class="opacity-40" aria-hidden="true">•</span>
			{/if}
			{#if publication.venue}
				<span>{publication.venue}</span>
				<span class="opacity-40" aria-hidden="true">•</span>
			{/if}
			<span>{formatEntityDate(publication)}</span>
		</div>
	</Card.Header>

	<Card.Content class={cn('flex flex-col gap-4', matchHeight && 'flex-1')}>
		<MarkdownInline markdown={abstractInline()} {skills} {technologies} class="text-sm" />
		{#if visibleTechnologies.length > 0}
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
		{/if}
	</Card.Content>

	{#if showActions}
		<Card.Footer class="flex flex-wrap items-start justify-between gap-2">
			<div class="flex flex-wrap gap-2">
				{#each resolvedLinks.slice(0, 2) as link}
					{@const Icon = iconFor(link.icon)}
					<Button
						href={link.url}
						variant={link.type === 'paper' ? 'default' : 'outline'}
						size="sm"
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}
					>
						<Icon />
						{link.label}
					</Button>
				{/each}
			</div>
			<Button href={`/publications/${publication.slug}`} variant="ghost" size="sm">Details</Button>
		</Card.Footer>
	{/if}
</Card.Root>
