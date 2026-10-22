<script lang="ts">
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import GraphDialog from '$lib/components/GraphDialog.svelte';

	let { data } = $props();
</script>

<section class="grid gap-8 md:grid-cols-[1fr_15rem] md:items-start">
	<div class="space-y-4">
		<h1 class="text-xl font-bold leading-snug">{data.profile.headline}</h1>
		<p class="text-sm text-muted-foreground">{data.profile.location}</p>
		<MarkdownBlock
			markdown={data.profile.summaryMarkdown}
			skills={data.skills}
			technologies={data.technologies}
		/>
		<div class="flex flex-wrap gap-3 pt-1">
			{#if data.cvUrl}
				<a class="btn btn-primary" href={data.cvUrl} target="_blank" rel="noreferrer">download cv ↓</a>
			{/if}
			<a class="btn" href="/contact">get in touch →</a>
		</div>
	</div>
	<GraphDialog data={data.graph} />
</section>

<section class="mt-16 space-y-6">
	<h2 class="h-section">featured projects</h2>
	<ul class="space-y-8">
		{#each data.featuredProjects as project (project.slug)}
			<li>
				<ProjectCard
					{project}
					technologies={data.technologies}
					skills={data.skills}
					roles={data.roles}
					maxVisibleTechnologies={6}
				/>
			</li>
		{/each}
	</ul>
	<a class="link inline-block text-sm" href="/projects">all projects →</a>
</section>

<section class="mt-16 space-y-6">
	<h2 class="h-section">recent experience</h2>
	<ul class="space-y-8">
		{#each data.experience as item (item.slug)}
			<li>
				<ExperienceCard experience={item} skills={data.skills} technologies={data.technologies} />
			</li>
		{/each}
	</ul>
</section>
