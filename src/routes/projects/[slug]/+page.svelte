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
	import ProjectStatusBadge from '$lib/components/ProjectStatusBadge.svelte';
	import RoleBadge from '$lib/components/RoleBadge.svelte';
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatEntityDate } from '$lib/content/format';
	import { resolveLink } from '$lib/content/presentation';
	import type { Component } from 'svelte';

	let { data } = $props();

	const links = $derived(data.project.links.map((link) => resolveLink(link)));

	const relatedExperienceItems = $derived(
		data.relatedExperience.map((item) => ({
			label: `${item.title} - ${item.organization}`,
			href: `/experience/${item.slug}`,
			type: 'experience'
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

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Project</p>
		<h1 class="text-4xl font-semibold tracking-tight">{data.project.title}</h1>
		<p class="text-muted-foreground">{data.project.subtitle}</p>
	</header>

	<div class="flex flex-wrap items-center gap-2 text-sm">
		<RoleBadge roleId={data.project.role} roles={data.roles} />
		<ProjectStatusBadge status={data.project.status} />
		<Badge variant="outline">{formatEntityDate(data.project)}</Badge>
	</div>

	{#if data.project.thumbnail}
		<img
			src={data.project.thumbnail}
			alt={data.project.title}
			class="max-h-80 w-full border border-border object-cover"
		/>
	{/if}

	<p class="max-w-3xl leading-7">{data.project.abstract}</p>
	<p class="max-w-3xl leading-7">{data.project.description}</p>

	<section>
		<h2 class="mb-3 text-2xl font-semibold">Highlights</h2>
		<ul class="list-disc space-y-2 pl-5">
			{#each data.project.highlights as highlight}
				<li>{highlight}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="mb-3 text-2xl font-semibold">Technologies</h2>
		<div class="flex flex-wrap gap-2">
			{#each data.project.technologies as tech}
				<TechBadge
					techId={tech}
					technologies={data.technologies}
					skills={data.skills}
					class="px-3 py-1 text-sm"
				/>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-3 text-2xl font-semibold">Skills</h2>
		<div class="flex flex-wrap gap-2">
			{#each data.project.skills as skillId}
				<SkillBadge
					skillId={skillId}
					skills={data.skills}
					technologies={data.technologies}
					class="px-3 py-1 text-sm"
				/>
			{/each}
		</div>
	</section>

	{#if links.length > 0}
		<section>
			<h2 class="mb-3 text-2xl font-semibold">Links</h2>
			<div class="flex flex-wrap gap-2">
				{#each links as link}
					{@const Icon = iconFor(link.icon)}
					<Button
						href={link.url}
						variant={link.type === 'github' ? 'default' : 'outline'}
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

	{#if data.relatedExperience.length > 0}
		<RelationshipPanel title="Related Experience" items={relatedExperienceItems} />
	{/if}
</article>
