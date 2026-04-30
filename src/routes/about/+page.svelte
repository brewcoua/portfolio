<script lang="ts">
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import { formatEntityDate } from '$lib/content/format';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';

	let { data } = $props();

	const highlightedSkills = $derived(
		data.profile.skillsHighlight.filter((id) => data.skills.some((skill) => skill.id === id))
	);
	const highlightedTechnologies = $derived(
		data.profile.skillsHighlight.filter((id) =>
			data.technologies.some((technology) => technology.id === id)
		)
	);
</script>

<section class="space-y-5">
	<h1 class="text-4xl font-semibold tracking-tight">About</h1>
	<p class="max-w-3xl text-lg text-muted-foreground">{data.profile.summary}</p>
	<p class="max-w-3xl text-sm leading-7">
		I am currently based in Delft and focused on building robust software across fullstack systems,
		AI integrations, and research-oriented projects.
	</p>
</section>

<section class="mt-12 space-y-4">
	<h2 class="text-2xl font-semibold">Experience</h2>
	<p class="text-muted-foreground">Internships and research timeline.</p>
	<div class="space-y-4">
		{#each data.experience as item}
			<ExperienceCard experience={item} />
		{/each}
	</div>
</section>

<section class="mt-12 space-y-4">
	<h2 class="text-2xl font-semibold">Skills & Technologies Highlight</h2>
	<div class="grid gap-6 md:grid-cols-2">
		<div class="space-y-2">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills</h3>
			<div class="flex flex-wrap gap-2">
				{#if highlightedSkills.length > 0}
					{#each highlightedSkills as skillId}
						<SkillBadge
							{skillId}
							skills={data.skills}
							technologies={data.technologies}
							class="px-2 py-1 text-xs"
						/>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">No highlighted skills yet.</p>
				{/if}
			</div>
		</div>
		<div class="space-y-2">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Technologies</h3>
			<div class="flex flex-wrap gap-2">
				{#if highlightedTechnologies.length > 0}
					{#each highlightedTechnologies as techId}
						<TechBadge
							{techId}
							technologies={data.technologies}
							skills={data.skills}
							class="px-2 py-1 text-xs"
						/>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">No highlighted technologies yet.</p>
				{/if}
			</div>
		</div>
	</div>
</section>

<section class="mt-12 space-y-4">
	<h2 class="text-2xl font-semibold">Education & Research</h2>
	<p class="text-muted-foreground">Academic track and research-oriented activities.</p>
	<div class="space-y-4">
		{#each data.education as item}
			<Card.Root>
				<Card.Header>
					<div class="flex flex-wrap items-start justify-between gap-2">
						<div>
							<Card.Title class="text-xl">{item.degree}</Card.Title>
							<Card.Description>{item.institution}</Card.Description>
							<p class="text-sm text-muted-foreground">{item.location}</p>
						</div>
						<p class="text-sm text-muted-foreground">{formatEntityDate(item)}</p>
					</div>
				</Card.Header>
				{#if item.highlights.length > 0 || item.subEducation?.length}
					<Card.Content>
						{#if item.highlights.length > 0}
							<ul class="list-disc space-y-1 pl-5 text-sm">
								{#each item.highlights as highlight}
									<li>{highlight}</li>
								{/each}
							</ul>
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
												<div>
													<Card.Title class="text-xs leading-tight">{subItem.degree}</Card.Title>
													<Card.Description class="text-xs leading-tight">{subItem.institution}</Card.Description>
													<p class="text-xs text-muted-foreground">{subItem.location}</p>
												</div>
												<p class="text-xs text-muted-foreground">{formatEntityDate(subItem)}</p>
											</div>
										</Card.Header>
										{#if subItem.highlights.length > 0}
											<Card.Content class="pt-0 pb-1 pl-3 pr-2">
												<ul class="list-disc space-y-0 pl-4 text-xs leading-tight">
													{#each subItem.highlights as subHighlight}
														<li>{subHighlight}</li>
													{/each}
												</ul>
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
