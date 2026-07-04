<script lang="ts">
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import OrgBrandMark from '$lib/components/OrgBrandMark.svelte';
	import * as Card from '$lib/components/ui/card';
	import { formatEducationGrade, formatEntityDate } from '$lib/content/format';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { Button } from '$lib/components/ui/button';
	import { MapPin } from '@lucide/svelte';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import DownloadIcon from '@lucide/svelte/icons/download';

	let { data } = $props();

	const mentionedSkills = $derived(data.mentionedSkills ?? []);
	const mentionedTechnologies = $derived(data.mentionedTechnologies ?? []);

	function isExternalHref(href: string): boolean {
		return /^(https?:|mailto:)/.test(href);
	}
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
	<div class="space-y-4">
		{#each data.education as item}
			<Card.Root>
				<Card.Header>
					<div class="flex flex-wrap items-start justify-between gap-2">
						<div class="flex min-w-0 flex-1 items-start gap-3">
							<OrgBrandMark logo={item.logo} label={item.institution} website={item.website} />
							<div class="min-w-0 flex-1">
								<Card.Title class="text-xl">
									<a class="group inline-flex items-center gap-1.5 hover:text-primary" href={`/education/${item.slug}`}>
										{item.degree}
										<ArrowUpRightIcon
											class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
											aria-hidden="true"
										/>
									</a>
								</Card.Title>
								<Card.Description>
									{#if item.website}
										<a
											class="underline-offset-2 hover:text-foreground hover:underline"
											href={item.website}
											target={isExternalHref(item.website) ? '_blank' : undefined}
											rel={isExternalHref(item.website) ? 'noopener noreferrer' : undefined}
										>
											{item.institution}
										</a>
									{:else}
										{item.institution}
									{/if}
								</Card.Description>
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
				{#if
					item.highlights.length > 0 ||
						item.activities.length > 0 ||
						item.societies.length > 0 ||
						item.subEducation?.length}
					<Card.Content class="space-y-4">
						{#if item.highlights.length > 0}
							<ul class="list-disc space-y-1 pl-5 text-sm">
								{#each item.highlights as _, highlightIndex}
									<li>
										<MarkdownInline
											markdown={item.highlightsMarkdown?.[highlightIndex]}
											skills={data.skills}
											technologies={data.technologies}
										/>
									</li>
								{/each}
							</ul>
						{/if}
						{#if item.activities.length > 0}
							<div class="space-y-1.5">
								<h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Activities
								</h4>
								<ul class="list-disc space-y-1 pl-5 text-sm">
									{#each item.activities as _, activityIndex}
										<li>
											<MarkdownInline
												markdown={item.activitiesMarkdown?.[activityIndex]}
												skills={data.skills}
												technologies={data.technologies}
											/>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if item.societies.length > 0}
							<div class="space-y-1.5">
								<h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									Societies
								</h4>
								<ul class="list-disc space-y-1 pl-5 text-sm">
									{#each item.societies as _, societyIndex}
										<li>
											<MarkdownInline
												markdown={item.societiesMarkdown?.[societyIndex]}
												skills={data.skills}
												technologies={data.technologies}
											/>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if item.subEducation?.length}
							<div class="mt-1.5 space-y-1">
								{#each item.subEducation as subItem}
									<Card.Root class="relative gap-0 overflow-hidden bg-muted/20 py-0">
										<span
											class="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-primary/55 [clip-path:inset(1px_0_1px_0)]"
											aria-hidden="true"
										></span>
										<Card.Header class="space-y-0 pl-3 pr-2 py-1">
											<div class="flex flex-wrap items-start justify-between gap-2">
												<div class="flex min-w-0 flex-1 items-start gap-2">
													<OrgBrandMark
														logo={subItem.logo}
														label={subItem.institution}
														website={subItem.website}
														size="sm"
													/>
													<div class="min-w-0 flex-1">
														<Card.Title class="text-xs leading-tight">{subItem.degree}</Card.Title>
														<Card.Description class="text-xs leading-tight">
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
															<div class="mt-0.5 flex flex-wrap gap-1">
																{#each subItem.track as t}
																	<span class="rounded border border-border bg-muted/40 px-1 py-px text-[10px] font-medium text-muted-foreground">{t}</span>
																{/each}
															</div>
														{/if}
													</div>
												</div>
												<div class="text-right">
													{#if subItem.grade}
														<p class="text-xs font-semibold">{formatEducationGrade(subItem.grade)}</p>
													{/if}
													<p class="text-xs text-muted-foreground">{formatEntityDate(subItem)}</p>
													<p class="mt-0.5 flex items-center justify-end gap-1 text-[10px] italic text-muted-foreground">
														<MapPin class="size-2.5 shrink-0" aria-hidden="true" />{subItem.location}
													</p>
												</div>
											</div>
										</Card.Header>
										{#if subItem.highlights.length > 0 || subItem.activities.length > 0 || subItem.societies.length > 0}
											<Card.Content class="space-y-2 pt-0 pb-1 pl-3 pr-2">
												{#if subItem.highlights.length > 0}
													<ul class="list-disc space-y-0 pl-4 text-xs leading-tight">
														{#each subItem.highlights as _, subHighlightIndex}
															<li>
																<MarkdownInline
																	markdown={subItem.highlightsMarkdown?.[subHighlightIndex]}
																	skills={data.skills}
																	technologies={data.technologies}
																/>
															</li>
														{/each}
													</ul>
												{/if}
												{#if subItem.activities.length > 0}
													<div class="space-y-0.5">
														<h5 class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
															Activities
														</h5>
														<ul class="list-disc space-y-0 pl-4 text-xs leading-tight">
															{#each subItem.activities as _, subActivityIndex}
																<li>
																	<MarkdownInline
																		markdown={subItem.activitiesMarkdown?.[subActivityIndex]}
																		skills={data.skills}
																		technologies={data.technologies}
																	/>
																</li>
															{/each}
														</ul>
													</div>
												{/if}
												{#if subItem.societies.length > 0}
													<div class="space-y-0.5">
														<h5 class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
															Societies
														</h5>
														<ul class="list-disc space-y-0 pl-4 text-xs leading-tight">
															{#each subItem.societies as _, subSocietyIndex}
																<li>
																	<MarkdownInline
																		markdown={subItem.societiesMarkdown?.[subSocietyIndex]}
																		skills={data.skills}
																		technologies={data.technologies}
																	/>
																</li>
															{/each}
														</ul>
													</div>
												{/if}
											</Card.Content>
										{/if}
									</Card.Root>
								{/each}
							</div>
						{/if}
					</Card.Content>
				{/if}
			</Card.Root>
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
