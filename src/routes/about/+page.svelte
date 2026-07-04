<script lang="ts">
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import OrgBrandMark from '$lib/components/OrgBrandMark.svelte';
	import * as Card from '$lib/components/ui/card';
	import { formatEducationGrade, formatEntityDate } from '$lib/content/format';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { Button } from '$lib/components/ui/button';
	import { MapPin } from '@lucide/svelte';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import DownloadIcon from '@lucide/svelte/icons/download';

	let { data } = $props();

	const mentionedSkills = $derived(data.mentionedSkills ?? []);
	const mentionedTechnologies = $derived(data.mentionedTechnologies ?? []);
</script>

<section class="space-y-5">
	<h1 class="text-4xl font-semibold tracking-tight">About</h1>
	<MarkdownBlock
		markdown={data.profile.summaryMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		class="max-w-3xl text-lg text-muted-foreground"
	/>
	<p class="max-w-3xl text-sm leading-7">
		Based in Delft, I focus on building robust full-stack products with strong backend architecture,
		practical agentic integrations, and research-informed engineering.
	</p>
	{#if data.cvUrl}
		<div class="pt-1">
			<Button href={data.cvUrl} variant="outline" target="_blank" rel="noreferrer">
				<DownloadIcon class="size-4" aria-hidden="true" />
				Download CV
			</Button>
		</div>
	{/if}
</section>

<section class="mt-12 space-y-4">
	<h2 class="text-2xl font-semibold">Education & Research</h2>
	<p class="text-muted-foreground">Academic track and research-oriented activities.</p>
	<div class="space-y-3">
		{#each data.education as item}
			<a href={`/education/${item.slug}`} class="group block">
				<Card.Root class="transition-colors group-hover:border-primary">
					<Card.Header>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div class="flex min-w-0 flex-1 items-start gap-3">
								<OrgBrandMark logo={item.logo} label={item.institution} website={item.website} />
								<div class="min-w-0 flex-1">
									<Card.Title class="flex items-center gap-1.5 text-xl">
										{item.degree}
										<ArrowUpRightIcon
											class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
											aria-hidden="true"
										/>
									</Card.Title>
									<Card.Description>{item.institution}</Card.Description>
									{#if item.track && item.track.length > 0}
										<div class="mt-1 flex flex-wrap gap-1">
											{#each item.track as t}
												<span class="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{t}</span>
											{/each}
										</div>
									{/if}
								</div>
							</div>
							<div class="text-right">
								{#if item.grade}
									<p class="text-sm font-semibold">{formatEducationGrade(item.grade)}</p>
								{/if}
								<p class="text-sm text-muted-foreground">{formatEntityDate(item)}</p>
								<p class="mt-0.5 flex items-center justify-end gap-1 text-xs italic text-muted-foreground">
									<MapPin class="size-3 shrink-0" aria-hidden="true" />{item.location}
								</p>
							</div>
						</div>
					</Card.Header>
				</Card.Root>
			</a>
		{/each}
	</div>
</section>

<section class="mt-12 space-y-4">
	<h2 class="text-2xl font-semibold">Experience</h2>
	<p class="text-muted-foreground">Internships and research timeline.</p>
	<div class="space-y-4">
		{#each data.experience as item}
			<ExperienceCard experience={item} skills={data.skills} technologies={data.technologies} />
		{/each}
	</div>
</section>

<section id="skills-technologies" class="mt-12 space-y-4">
	<h2 class="text-2xl font-semibold">Skills & Technologies</h2>
	<p class="text-muted-foreground">
		Dynamically aggregated from projects, experience, and education entries.
	</p>
	<div class="grid gap-6 md:grid-cols-2">
		<div class="space-y-2">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills</h3>
			<div class="flex flex-wrap gap-2">
				{#if mentionedSkills.length > 0}
					{#each mentionedSkills as skill}
						<SkillBadge
							skillId={skill.id}
							mentionedIn={skill.sources}
							skills={data.skills}
							technologies={data.technologies}
							class="px-2 py-1 text-xs"
						/>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">No mentioned skills yet.</p>
				{/if}
			</div>
		</div>
		<div class="space-y-2">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Technologies</h3>
			<div class="flex flex-wrap gap-2">
				{#if mentionedTechnologies.length > 0}
					{#each mentionedTechnologies as technology}
						<TechBadge
							techId={technology.id}
							mentionedIn={technology.sources}
							technologies={data.technologies}
							skills={data.skills}
							class="px-2 py-1 text-xs"
						/>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">No mentioned technologies yet.</p>
				{/if}
			</div>
		</div>
	</div>
</section>
