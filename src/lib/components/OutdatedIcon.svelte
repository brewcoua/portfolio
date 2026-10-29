<script lang="ts">
	import GitCompareArrowsIcon from '@lucide/svelte/icons/git-compare-arrows';
	import { loadRepoStatus, repoStatus } from '$lib/repo-status.svelte';
	import type { Project } from '$lib/content/types';

	let { slug, source }: { slug: string; source: NonNullable<Project['source']> } = $props();

	$effect(loadRepoStatus);

	const ahead = $derived(repoStatus.aheadBy[slug] ?? 0);
</script>

{#if ahead > 0}
	<a
		class="meta link text-primary"
		href={`https://github.com/${source.repo}/compare/${source.commit}...HEAD`}
		target="_blank"
		rel="noreferrer"
		title={`${ahead} commit${ahead === 1 ? '' : 's'} since this was written; it may be out of date`}
		aria-label="Description may be out of date"><GitCompareArrowsIcon class="size-3.5" /></a
	>
{/if}
