<script lang="ts">
	import { formatReferenceMeta } from '$lib/content/format';
	import type { ProjectReference } from '$lib/content/types';

	let { references } = $props<{ references: ProjectReference[] }>();
</script>

<section>
	<h2 class="h-section mb-3">References</h2>
	<ol class="space-y-2.5 text-sm">
		{#each references as reference}
			<li class="flex gap-2 leading-snug">
				<span class="mt-px shrink-0 text-muted-foreground">[{reference.year}]</span>
				<span class="min-w-0">
					{#if reference.url}
						<a
							href={reference.url}
							target="_blank"
							rel="noreferrer"
							class="font-medium underline-offset-2 hover:text-primary hover:underline"
						>{reference.title}</a>
					{:else}
						<span class="font-medium">{reference.title}</span>
					{/if}
					<span class="text-muted-foreground"> — {formatReferenceMeta(reference)}</span>
					{#if reference.doi}
						<a
							href={`https://doi.org/${reference.doi}`}
							target="_blank"
							rel="noreferrer"
							class="ml-1 whitespace-nowrap text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
						>DOI ↗</a>
					{/if}
				</span>
			</li>
		{/each}
	</ol>
</section>
