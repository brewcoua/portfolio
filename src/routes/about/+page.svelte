<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();
</script>

<section class="space-y-5">
	<h1 class="text-4xl font-semibold tracking-tight">About</h1>
	<p class="max-w-3xl text-lg text-muted-foreground">{data.profile.summary}</p>
	<p class="max-w-3xl text-sm leading-7">
		I am currently based in Delft and focused on building robust software across fullstack systems,
		AI integrations, and research-oriented projects.
	</p>
</section>

<section class="mt-12">
	<h2 class="mb-4 text-2xl font-semibold">Focus Domains</h2>
	<ul class="flex flex-wrap gap-2">
		{#each data.profile.roles as role}
			<li><Badge variant="outline">{role}</Badge></li>
		{/each}
	</ul>
</section>

<section class="mt-12">
	<h2 class="mb-4 text-2xl font-semibold">Skills Highlight</h2>
	<ul class="flex flex-wrap gap-2">
		{#each data.profile.skillsHighlight as skill}
			<li><Badge variant="outline">{skill}</Badge></li>
		{/each}
	</ul>
</section>
