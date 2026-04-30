<script lang="ts">
	import ExperienceCard from '$lib/components/ExperienceCard.svelte';

	let { data } = $props();
</script>

<section class="space-y-4">
	<h1 class="text-4xl font-semibold tracking-tight">Experience</h1>
	<p class="text-muted-foreground">Internships and research timeline.</p>
</section>

<section class="mt-8 space-y-4">
	{#each data.experience as item}
		<ExperienceCard experience={item} />
	{/each}
</section>
