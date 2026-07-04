<script lang="ts">
	import PublicationCard from '$lib/components/PublicationCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Publications</title>
</svelte:head>

<section class="space-y-4">
	<h1 class="text-4xl font-semibold tracking-tight">Publications</h1>
	<p class="text-muted-foreground">
		Papers, reports, and research write-ups — each linking to its companion project, dataset, and
		code.
	</p>
</section>

<section class="mt-8">
	{#if data.publications.length === 0}
		<div class="border border-border p-6 text-sm text-muted-foreground">
			No publications yet.
		</div>
	{:else}
		<div class="columns-1 gap-4 md:columns-2">
			{#each data.publications as publication}
				<div class="mb-4 break-inside-avoid">
					<PublicationCard
						{publication}
						technologies={data.technologies}
						skills={data.skills}
						maxVisibleTechnologies={5}
					/>
				</div>
			{/each}
		</div>
	{/if}
</section>
