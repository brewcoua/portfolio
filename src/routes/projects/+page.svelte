<script lang="ts">
	import { filterProjects } from '$lib/content/project-discovery';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectStatusFilter from '$lib/components/ProjectStatusFilter.svelte';
	import RoleFilter from '$lib/components/RoleFilter.svelte';
	import TechnologyFilter from '$lib/components/TechnologyFilter.svelte';
	import type { ProjectStatus } from '$lib/content/types';

	let { data } = $props();
	let query = $state('');
	let selectedTech = $state<string>('all');
	let selectedStatus = $state<ProjectStatus | 'all'>('all');
	let selectedRole = $state<string>('all');

	const filteredProjects = $derived(
		filterProjects(data.projects, {
			query,
			technology: selectedTech,
			status: selectedStatus,
			role: selectedRole
		})
	);
</script>

<section class="space-y-4">
	<h1 class="text-4xl font-semibold tracking-tight">Projects</h1>
	<p class="text-muted-foreground">
		Search by title, abstract, description, technologies, and skills. Narrow results by technology,
		status, and role.
	</p>
</section>

<section class="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
	<div class="space-y-4">
		<input
			bind:value={query}
			type="search"
			placeholder="Search projects..."
			class="h-10 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
		/>

		{#if filteredProjects.length === 0}
			<div class="border border-border p-6 text-sm text-muted-foreground">
				No projects match current filters.
			</div>
		{:else}
			<div class="columns-1 gap-4 md:columns-2">
				{#each filteredProjects as project}
					<div class="mb-4 break-inside-avoid">
						<ProjectCard
							{project}
							technologies={data.technologies}
							skills={data.skills}
							roles={data.roles}
							maxVisibleTechnologies={5}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<aside class="space-y-4 border border-border p-4">
		<TechnologyFilter technologies={data.filterOptions.technologies} bind:selected={selectedTech} />

		<ProjectStatusFilter statuses={data.filterOptions.statuses} bind:selected={selectedStatus} />

		<RoleFilter roles={data.filterOptions.roles} bind:selected={selectedRole} />
	</aside>
</section>
