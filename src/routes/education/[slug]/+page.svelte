<script lang="ts">
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import OrgLogo from '$lib/components/OrgLogo.svelte';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import { formatEducationGrade, formatEntityDate } from '$lib/content/format';

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
		<p class="text-sm text-muted-foreground"># education</p>
		<div class="flex flex-wrap items-start gap-4">
			<OrgLogo src={edu.logo} size={32} class="mt-1" />
			<div class="min-w-0 flex-1 space-y-2">
				<h1 class="text-xl font-bold leading-snug">{edu.degree}</h1>
				<p class="text-muted-foreground">
					{#if edu.website}
						<a
							class="link"
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
					<span class="flex items-center gap-1">@ {edu.location}</span>
				</p>
				{#if edu.track && edu.track.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each edu.track as t}
							<span class="tag">{t}</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</header>

	{#if edu.description?.trim()}
		<MarkdownBlock
			markdown={edu.descriptionMarkdown}
			skills={data.skills}
			technologies={data.technologies}
			
		/>
	{/if}

	{#if edu.highlights.length > 0}
		<section>
			<h2 class="h-section mb-3">Highlights</h2>
			<ul class="list-disc marker:text-muted-foreground space-y-2 pl-5">
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
			<h2 class="h-section mb-3">Activities</h2>
			<ul class="list-disc marker:text-muted-foreground space-y-2 pl-5">
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
			<h2 class="h-section mb-3">Societies</h2>
			<ul class="list-disc marker:text-muted-foreground space-y-2 pl-5">
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
			<h2 class="h-section">Within this program</h2>
			{#each edu.subEducation as subItem}
				<article class="space-y-2 border-l border-dashed pl-4">
					<div class="space-y-1">
						<div class="flex flex-wrap items-start justify-between gap-2">
							<div class="flex min-w-0 flex-1 items-start gap-3">
								<div class="min-w-0 flex-1">
									<h3 class="font-bold">{subItem.degree}</h3>
									<p class="text-sm text-muted-foreground">
										{#if subItem.website}
											<a
												class="link"
												href={subItem.website}
												target={isExternalHref(subItem.website) ? '_blank' : undefined}
												rel={isExternalHref(subItem.website) ? 'noopener noreferrer' : undefined}
											>
												{subItem.institution}
											</a>
										{:else}
											{subItem.institution}
										{/if}
									</p>
									{#if subItem.track && subItem.track.length > 0}
										<div class="mt-1 flex flex-wrap gap-1">
											{#each subItem.track as t}
												<span class="tag">{t}</span>
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
								<p class="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
									@ {subItem.location}
								</p>
							</div>
						</div>
					</div>
					{#if subItem.highlights.length > 0 || subItem.activities.length > 0 || subItem.societies.length > 0}
						<div class="space-y-3">
							{#if subItem.highlights.length > 0}
								<ul class="list-disc marker:text-muted-foreground space-y-1 pl-5 text-sm">
									{#each subItem.highlights as _, i}
										<li><MarkdownInline markdown={subItem.highlightsMarkdown?.[i]} skills={data.skills} technologies={data.technologies} /></li>
									{/each}
								</ul>
							{/if}
							{#if subItem.activities.length > 0}
								<div class="space-y-1">
									<h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activities</h4>
									<ul class="list-disc marker:text-muted-foreground space-y-1 pl-5 text-sm">
										{#each subItem.activities as _, i}
											<li><MarkdownInline markdown={subItem.activitiesMarkdown?.[i]} skills={data.skills} technologies={data.technologies} /></li>
										{/each}
									</ul>
								</div>
							{/if}
							{#if subItem.societies.length > 0}
								<div class="space-y-1">
									<h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Societies</h4>
									<ul class="list-disc marker:text-muted-foreground space-y-1 pl-5 text-sm">
										{#each subItem.societies as _, i}
											<li><MarkdownInline markdown={subItem.societiesMarkdown?.[i]} skills={data.skills} technologies={data.technologies} /></li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					{/if}
				</article>
			{/each}
		</section>
	{/if}

	{#if linkedItems.length > 0}
		<RelationshipPanel title="Linked Work" items={linkedItems} />
	{/if}
</article>
