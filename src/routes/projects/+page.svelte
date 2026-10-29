<script lang="ts">
	import { filterProjects, sortProjects, type ProjectSort } from '$lib/content/project-discovery';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import { getProjectStatusLabel } from '$lib/content/presentation';
	import { PROJECT_KIND_LABELS, type ProjectKind, type ProjectStatus } from '$lib/content/types';

	let { data } = $props();
	let query = $state('');
	let selectedTech = $state<string>('all');
	let selectedStatus = $state<string>('all');
	let selectedRole = $state<string>('all');
	let selectedKind = $state<string>('all');
	let sort = $state<string>('newest');
	const sortItems = (['newest', 'oldest', 'complexity', 'value'] as const).map((value) => ({
		value,
		label: value
	}));

	const filteredProjects = $derived(
		sortProjects(filterProjects(data.projects, {
			query,
			technology: selectedTech,
			status: selectedStatus as ProjectStatus | 'all',
			role: selectedRole,
			kind: selectedKind as ProjectKind | 'all'
		}), sort as ProjectSort)
	);
</script>

<section class="space-y-2">
	<h1 class="h-section text-xl">projects</h1>
	<p class="text-sm text-muted-foreground">
		{filteredProjects.length}/{data.projects.length} shown. Search matches titles, abstracts, technologies and skills.
	</p>
</section>

<section class="mt-6 space-y-1 border-y border-dashed py-3">
	<div class="flex items-baseline gap-6">
		<label class="flex min-w-0 flex-1 items-baseline gap-2 py-1 text-sm">
			<span class="text-muted-foreground">search:</span>
			<input
				bind:value={query}
				type="search"
				placeholder="_"
				class="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
			/>
		</label>
		<div class="w-40 shrink-0">
			<FilterSelect label="sort" items={sortItems} includeAll={false} bind:value={sort} />
		</div>
	</div>
	<div class="grid gap-x-6 sm:grid-cols-2">
		<FilterSelect
			label="tech"
			items={data.filterOptions.technologies.map((t) => ({ value: t.id, label: t.label }))}
			bind:value={selectedTech}
		/>
		<FilterSelect
			label="status"
			items={data.filterOptions.statuses.map((s) => ({ value: s, label: getProjectStatusLabel(s) }))}
			bind:value={selectedStatus}
		/>
		{#if data.filterOptions.kinds.length > 0}
			<FilterSelect
				label="type"
				items={data.filterOptions.kinds.map((k) => ({ value: k, label: PROJECT_KIND_LABELS[k] }))}
				bind:value={selectedKind}
			/>
		{/if}
		<FilterSelect
			label="role"
			items={data.filterOptions.roles.map((r) => ({ value: r.id, label: r.label }))}
			bind:value={selectedRole}
		/>
	</div>
</section>

<section class="mt-8">
	{#if filteredProjects.length === 0}
		<p class="text-sm text-muted-foreground">no projects match current filters.</p>
	{:else}
		<ul class="space-y-8">
			{#each filteredProjects as project (project.slug)}
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
	{/if}
</section>
