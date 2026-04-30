<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	const labelByType: Record<string, string> = {
		github: 'GitHub',
		linkedin: 'LinkedIn',
		email: 'Email'
	};
</script>

<section class="space-y-4">
	<h1 class="text-4xl font-semibold tracking-tight">Contact</h1>
	<p class="text-muted-foreground">Reach out through public channels.</p>
</section>

<ul class="mt-8 flex flex-wrap gap-2">
	{#each data.links as link}
		<li>
			<Button
				href={link.url}
				variant="outline"
				size="sm"
				target={link.type === 'email' ? undefined : '_blank'}
				rel={link.type === 'email' ? undefined : 'noreferrer'}
			>
				{labelByType[link.type] ?? link.label ?? link.type}
			</Button>
		</li>
	{/each}
</ul>
