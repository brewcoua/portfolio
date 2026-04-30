<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();
</script>

<section class="space-y-5">
	<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Portfolio</p>
	<h1 class="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{data.profile.headline}</h1>
	<MarkdownBlock
		markdown={data.profile.summaryMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		class="max-w-3xl text-lg text-muted-foreground"
	/>

	<div class="flex flex-wrap gap-3 pt-2">
		<Button href="/projects" variant="outline">Explore Projects</Button>
		<Button href="/cv" variant="outline">Download CV</Button>
	</div>
</section>

<section class="mt-16">
	<h2 class="mb-5 text-2xl font-semibold">Featured Projects</h2>
	<div class="grid items-start gap-4 md:grid-cols-2">
		{#each data.featuredProjects as project}
			<ProjectCard
				{project}
				technologies={data.technologies}
				skills={data.skills}
				roles={data.roles}
				matchHeight
			/>
		{/each}
	</div>
</section>

<section class="mt-16">
	<h2 class="mb-5 text-2xl font-semibold">Recent Experience</h2>
	<div class="space-y-4">
		{#each data.experience as item}
			<ExperienceCard experience={item} skills={data.skills} technologies={data.technologies} />
		{/each}
	</div>
</section>
