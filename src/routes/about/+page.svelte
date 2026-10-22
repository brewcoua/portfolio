<script lang="ts">
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import { formatEducationGrade, formatEntityDate } from '$lib/content/format';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';

	let { data } = $props();

	const mentionedSkills = $derived(data.mentionedSkills ?? []);
	const mentionedTechnologies = $derived(data.mentionedTechnologies ?? []);

	function isExternalHref(href: string): boolean {
		return /^(https?:|mailto:)/.test(href);
	}
</script>

<section class="space-y-5">
	<h1 class="h-section text-xl">about</h1>
	<MarkdownBlock
		markdown={data.profile.summaryMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		class="text-muted-foreground"
	/>
	<p class="text-sm">
		Based in Delft, I focus on building robust full-stack products with strong backend architecture,
		practical agentic integrations, and research-informed engineering.
	</p>
	{#if data.cvUrl}
		<div class="pt-1">
			<a class="btn btn-primary" href={data.cvUrl} target="_blank" rel="noreferrer">download cv ↓</a>
		</div>
	{/if}
</section>

<section class="mt-12 space-y-4">
	<h2 class="h-section">Education & Research</h2>
	<p class="text-sm text-muted-foreground">Academic track and research-oriented activities.</p>
	<div class="space-y-4">
		{#each data.education as item}
			<article class="space-y-3">
				<div class="space-y-1">
					<div class="flex flex-wrap items-start justify-between gap-2">
						<div class="flex min-w-0 flex-1 items-start gap-3">
							<div class="min-w-0 flex-1">
								<h3 class="font-bold">
									<a class="hover:text-primary" href={`/education/${item.slug}`}>
										{item.degree}
									</a>
								</h3>
								<p class="text-sm text-muted-foreground">
									{#if item.website}
										<a
											class="link"
											href={item.website}
											target={isExternalHref(item.website) ? '_blank' : undefined}
											rel={isExternalHref(item.website) ? 'noopener noreferrer' : undefined}
										>
											{item.institution}
										</a>
									{:else}
										{item.institution}
									{/if}
								</p>
								{#if item.track && item.track.length > 0}
									<div class="mt-1 flex flex-wrap gap-1">
										{#each item.track as t}
											<span class="tag">{t}</span>
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
							<p class="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
								@ {item.location}
							</p>
						</div>
					</div>
				</div>
				{#if
					item.highlights.length > 0 ||
						item.activities.length > 0 ||
						item.societies.length > 0 ||
						item.subEducation?.length}
					<div class="space-y-3">
						{#if item.highlights.length > 0}
							<ul class="list-disc marker:text-muted-foreground space-y-1 pl-5 text-sm">
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
								<h4 class="text-xs text-muted-foreground"># activities</h4>
								<ul class="list-disc marker:text-muted-foreground space-y-1 pl-5 text-sm">
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
								<h4 class="text-xs text-muted-foreground"># societies</h4>
								<ul class="list-disc marker:text-muted-foreground space-y-1 pl-5 text-sm">
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
									<article class="space-y-2 border-l border-dashed pl-4">
										<div class="space-y-1">
											<div class="flex flex-wrap items-start justify-between gap-2">
												<div class="flex min-w-0 flex-1 items-start gap-2">
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
															<div class="mt-0.5 flex flex-wrap gap-1">
																{#each subItem.track as t}
																	<span class="tag">{t}</span>
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
													<p class="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
														@ {subItem.location}
													</p>
												</div>
											</div>
										</div>
										{#if subItem.highlights.length > 0 || subItem.activities.length > 0 || subItem.societies.length > 0}
											<div class="space-y-3">
												{#if subItem.highlights.length > 0}
													<ul class="list-disc marker:text-muted-foreground space-y-0 pl-4 text-xs leading-tight">
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
														<h5 class="text-xs text-muted-foreground"># activities</h5>
														<ul class="list-disc marker:text-muted-foreground space-y-0 pl-4 text-xs leading-tight">
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
														<h5 class="text-xs text-muted-foreground"># societies</h5>
														<ul class="list-disc marker:text-muted-foreground space-y-0 pl-4 text-xs leading-tight">
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
											</div>
										{/if}
									</article>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</article>
		{/each}
	</div>
</section>

<section class="mt-12 space-y-4">
	<h2 class="h-section">Experience</h2>
	<p class="text-sm text-muted-foreground">Internships and research timeline.</p>
	<div class="space-y-4">
		{#each data.experience as item}
			<ExperienceCard experience={item} skills={data.skills} technologies={data.technologies} />
		{/each}
	</div>
</section>

<section id="skills-technologies" class="mt-12 space-y-4">
	<h2 class="h-section">Skills & Technologies</h2>
	<p class="text-sm text-muted-foreground">
		Dynamically aggregated from projects, experience, and education entries.
	</p>
	<div class="grid gap-6 md:grid-cols-2">
		<div class="space-y-2">
			<h3 class="text-sm text-muted-foreground"># skills</h3>
			<div class="flex flex-wrap gap-x-2 gap-y-1">
				{#if mentionedSkills.length > 0}
					{#each mentionedSkills as skill}
						<SkillBadge
							skillId={skill.id}
							mentionedIn={skill.sources}
							skills={data.skills}
							technologies={data.technologies}
						/>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">No mentioned skills yet.</p>
				{/if}
			</div>
		</div>
		<div class="space-y-2">
			<h3 class="text-sm text-muted-foreground"># technologies</h3>
			<div class="flex flex-wrap gap-x-2 gap-y-1">
				{#if mentionedTechnologies.length > 0}
					{#each mentionedTechnologies as technology}
						<TechBadge
							techId={technology.id}
							mentionedIn={technology.sources}
							technologies={data.technologies}
							skills={data.skills}
						/>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">No mentioned technologies yet.</p>
				{/if}
			</div>
		</div>
	</div>
</section>
