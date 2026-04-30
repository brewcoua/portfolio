<script lang="ts">
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import type { MarkdownMentionKind, Skill, Technology } from '$lib/content/types';

	let {
		mentionKind,
		label,
		entityId,
		href,
		popoverTitle,
		popoverBody,
		skills = [],
		technologies = []
	}: {
		mentionKind: MarkdownMentionKind;
		label: string;
		entityId?: string;
		href?: string;
		popoverTitle?: string;
		popoverBody?: string;
		skills?: Skill[];
		technologies?: Technology[];
	} = $props();
</script>

{#if href}
	<a href={href} class="mention-link">{label}</a>
{:else if mentionKind === 'skill' && entityId}
	<SkillBadge
		skillId={entityId}
		{skills}
		{technologies}
		triggerMode="text"
		class="mention-popover-trigger"
	/>
{:else if mentionKind === 'technology' && entityId}
	<TechBadge
		techId={entityId}
		{skills}
		{technologies}
		triggerMode="text"
		class="mention-popover-trigger"
	/>
{:else}
	<span class="mention-link" title={popoverBody ?? popoverTitle ?? mentionKind}>{label}</span>
{/if}
