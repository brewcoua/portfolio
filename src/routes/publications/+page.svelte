<script lang="ts">
	import PublicationCard from '$lib/components/PublicationCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Publications</title>
</svelte:head>

<section class="space-y-2">
	<h1 class="h-section text-xl">publications</h1>
	<p class="text-sm text-muted-foreground">
		Papers, reports, and research write-ups — each linking to its companion project, dataset, and
		code.
	</p>
</section>

<section class="mt-8">
	{#if data.publications.length === 0}
		<p class="text-sm text-muted-foreground">no publications yet.</p>
	{:else}
		<ul class="space-y-8">
			{#each data.publications as publication}
				<li>
					<PublicationCard
						{publication}
						technologies={data.technologies}
						skills={data.skills}
						maxVisibleTechnologies={5}
					/>
				</li>
			{/each}
		</ul>
	{/if}
</section>
