<script lang="ts">
	import OrgBrandMark from '$lib/components/OrgBrandMark.svelte';
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import * as Card from '$lib/components/ui/card';
	import { formatEducationGrade, formatEntityDate } from '$lib/content/format';
	import { MapPin } from '@lucide/svelte';

	let { data } = $props();

	const edu = $derived(data.education);

	const linkedItems = $derived([
		...data.linkedExperience.map((item) => ({
			label: `${item.title} at ${item.organization}`,
			href: `/experience/${item.slug}`,
			type: 'experience'
		})),
		...data.linkedProjects.map((item) => ({
			label: item.title,
			href: `/projects/${item.slug}`,
			type: 'project'
		}))
	]);

	function isExternalHref(href: string): boolean {
		return /^(https?:|mailto:)/.test(href);
	}
</script>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Education</p>
		<div class="flex flex-wrap items-start gap-4">
			<OrgBrandMark logo={edu.logo} label={edu.institution} website={edu.website} />
			<div class="min-w-0 flex-1 space-y-2">
				<h1 class="text-4xl font-semibold tracking-tight">{edu.degree}</h1>
				<p class="text-muted-foreground">
					{#if edu.website}
						<a
							class="underline-offset-2 hover:text-foreground hover:underline"
							href={edu.website}
							target={isExternalHref(edu.website) ? '_blank' : undefined}
							rel={isExternalHref(edu.website) ? 'noopener noreferrer' : undefined}
						>
							{edu.institution}
						</a>
					{:else}
						{edu.institution}
					{/if}
					{' '}- {edu.location}
				</p>
				<p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
					<span>{formatEntityDate(edu)}</span>
					{#if edu.grade}
						<span class="font-semibold text-foreground">{formatEducationGrade(edu.grade)}</span>
					{/if}
					<span class="flex items-center gap-1"><MapPin class="size-3 shrink-0" aria-hidden="true" />{edu.location}</span>
				</p>
				{#if edu.track && edu.track.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each edu.track as t}
							<span class="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{t}</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</header>

	{#if edu.highlights.length > 0}
		<section>
			<h2 class="mb-3 text-2xl font-semibold">Highlights</h2>
			<ul class="list-disc space-y-2 pl-5">
				{#each edu.highlights as _, i}
					<li>
						<MarkdownInline markdown={edu.highlightsMarkdown?.[i]} skills={data.skills} technologies={data.technologies} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if edu.activities.length > 0}
		<section>
			<h2 class="mb-3 text-2xl font-semibold">Activities</h2>
			<ul class="list-disc space-y-2 pl-5">
				{#each edu.activities as _, i}
					<li>
						<MarkdownInline markdown={edu.activitiesMarkdown?.[i]} skills={data.skills} technologies={data.technologies} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if edu.societies.length > 0}
		<section>
			<h2 class="mb-3 text-2xl font-semibold">Societies</h2>
			<ul class="list-disc space-y-2 pl-5">
				{#each edu.societies as _, i}
					<li>
						<MarkdownInline markdown={edu.societiesMarkdown?.[i]} skills={data.skills} technologies={data.technologies} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if edu.subEducation?.length}
		<section class="space-y-3">
			<h2 class="text-2xl font-semibold">Within this program</h2>
			{#each edu.subEducation as subItem}
				<Card.Root class="relative overflow-hidden bg-muted/20">
					<span class="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-primary/55" aria-hidden="true"></span>
					<Card.Header>
						<div class="flex flex-wrap items-start justify-between gap-2">
							<div class="flex min-w-0 flex-1 items-start gap-3">
								<OrgBrandMark logo={subItem.logo} label={subItem.institution} website={subItem.website} size="sm" />
								<div class="min-w-0 flex-1">
									<Card.Title class="text-lg">{subItem.degree}</Card.Title>
									<Card.Description>
										{#if subItem.website}
											<a
												class="underline-offset-2 hover:text-foreground hover:underline"
												href={subItem.website}
												target={isExternalHref(subItem.website) ? '_blank' : undefined}
												rel={isExternalHref(subItem.website) ? 'noopener noreferrer' : undefined}
											>
												{subItem.institution}
											</a>
										{:else}
											{subItem.institution}
										{/if}
									</Card.Description>
									{#if subItem.track && subItem.track.length > 0}
										<div class="mt-1 flex flex-wrap gap-1">
											{#each subItem.track as t}
												<span class="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{t}</span>
											{/each}
										</div>
									{/if}
								</div>
							</div>
							<div class="text-right">
								{#if subItem.grade}
									<p class="text-sm font-semibold">{formatEducationGrade(subItem.grade)}</p>
								{/if}
								<p class="text-sm text-muted-foreground">{formatEntityDate(subItem)}</p>
								<p class="mt-0.5 flex items-center justify-end gap-1 text-xs italic text-muted-foreground">
									<MapPin class="size-3 shrink-0" aria-hidden="true" />{subItem.location}
								</p>
							</div>
						</div>
					</Card.Header>
					{#if subItem.highlights.length > 0 || subItem.activities.length > 0 || subItem.societies.length > 0}
						<Card.Content class="space-y-3">
							{#if subItem.highlights.length > 0}
								<ul class="list-disc space-y-1 pl-5 text-sm">
									{#each subItem.highlights as _, i}
										<li><MarkdownInline markdown={subItem.highlightsMarkdown?.[i]} skills={data.skills} technologies={data.technologies} /></li>
									{/each}
								</ul>
							{/if}
							{#if subItem.activities.length > 0}
								<div class="space-y-1">
									<h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activities</h4>
									<ul class="list-disc space-y-1 pl-5 text-sm">
										{#each subItem.activities as _, i}
											<li><MarkdownInline markdown={subItem.activitiesMarkdown?.[i]} skills={data.skills} technologies={data.technologies} /></li>
										{/each}
									</ul>
								</div>
							{/if}
							{#if subItem.societies.length > 0}
								<div class="space-y-1">
									<h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Societies</h4>
									<ul class="list-disc space-y-1 pl-5 text-sm">
										{#each subItem.societies as _, i}
											<li><MarkdownInline markdown={subItem.societiesMarkdown?.[i]} skills={data.skills} technologies={data.technologies} /></li>
										{/each}
									</ul>
								</div>
							{/if}
						</Card.Content>
					{/if}
				</Card.Root>
			{/each}
		</section>
	{/if}

	{#if linkedItems.length > 0}
		<RelationshipPanel title="Linked Work" items={linkedItems} />
	{/if}
</article>
