<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatEntityDate } from '$lib/content/format';

	let { data } = $props();
</script>

<section class="space-y-4">
	<h1 class="text-4xl font-semibold tracking-tight">Education & Research</h1>
	<p class="text-muted-foreground">Academic track and research-oriented activities.</p>
</section>

<section class="mt-8 space-y-4">
	{#each data.education as item}
		<Card.Root>
			<Card.Header>
				<div class="flex flex-wrap items-start justify-between gap-2">
					<div>
						<Card.Title class="text-xl">{item.degree}</Card.Title>
						<Card.Description>{item.institution}</Card.Description>
						<p class="text-sm text-muted-foreground">{item.location}</p>
					</div>
					<p class="text-sm text-muted-foreground">{formatEntityDate(item)}</p>
				</div>
			</Card.Header>
			{#if item.highlights.length > 0}
				<Card.Content>
					<ul class="list-disc space-y-1 pl-5 text-sm">
						{#each item.highlights as highlight}
							<li>{highlight}</li>
						{/each}
					</ul>
				</Card.Content>
			{/if}
		</Card.Root>
	{/each}
</section>
