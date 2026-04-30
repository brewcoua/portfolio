<script lang="ts">
	import { filterProjects } from '$lib/content/project-discovery';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
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
			<div class="grid gap-4 md:grid-cols-2">
				{#each filteredProjects as project}
					<ProjectCard
						{project}
						technologies={data.technologies}
						skills={data.skills}
						roles={data.roles}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<aside class="space-y-4 border border-border p-4">
		<div class="space-y-2">
			<label class="text-xs uppercase tracking-wide text-muted-foreground" for="technology-filter">
				Technology
			</label>
			<select
				id="technology-filter"
				bind:value={selectedTech}
				class="h-10 w-full border border-border bg-background px-3 py-2 text-sm"
			>
				<option value="all">All technologies</option>
				{#each data.filterOptions.technologies as technology}
					<option value={technology.id}>{technology.label}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-2">
			<label class="text-xs uppercase tracking-wide text-muted-foreground" for="status-filter">Status</label>
			<select
				id="status-filter"
				bind:value={selectedStatus}
				class="h-10 w-full border border-border bg-background px-3 py-2 text-sm"
			>
				<option value="all">All statuses</option>
				{#each data.filterOptions.statuses as status}
					<option value={status} class="capitalize">{status}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-2">
			<label class="text-xs uppercase tracking-wide text-muted-foreground" for="role-filter">Role</label>
			<select
				id="role-filter"
				bind:value={selectedRole}
				class="h-10 w-full border border-border bg-background px-3 py-2 text-sm"
			>
				<option value="all">All roles</option>
				{#each data.filterOptions.roles as role}
					<option value={role.id}>{role.label}</option>
				{/each}
			</select>
		</div>
	</aside>
</section>
