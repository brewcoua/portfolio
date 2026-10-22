<script lang="ts">
	import { formatEntityDate } from '$lib/content/format';
	import OrgLogo from '$lib/components/OrgLogo.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import type { Experience, MarkdownInlineNode, Skill, Technology } from '$lib/content/types';

	let { experience, skills = [], technologies = [] } = $props<{
		experience: Experience;
		skills?: Skill[];
		technologies?: Technology[];
	}>();

	const orgHrefExternal = $derived(
		experience.website ? /^(https?:|mailto:)/.test(experience.website) : false
	);

	function firstParagraphInline(): MarkdownInlineNode[] {
		const first = experience.summaryMarkdown?.blocks[0];
		return first?.type === 'paragraph' ? first.children : [];
	}
</script>

<article class="space-y-1.5">
	<header class="flex items-baseline gap-3">
		<a class="font-bold hover:text-primary" href={`/experience/${experience.slug}`}>{experience.title}</a>
		<span class="leader" aria-hidden="true"></span>
		<span class="shrink-0 text-sm text-muted-foreground">{formatEntityDate(experience)}</span>
	</header>
	<p class="flex flex-wrap items-baseline gap-x-3 text-sm text-muted-foreground">
		<OrgLogo src={experience.logo} class="-mr-1.5" />
		{#if experience.website}
			<a
				class="link"
				href={experience.website}
				target={orgHrefExternal ? '_blank' : undefined}
				rel={orgHrefExternal ? 'noopener noreferrer' : undefined}
			>{experience.organization}</a>
		{:else}
			<span>{experience.organization}</span>
		{/if}
		<span class="tag lowercase">{experience.employmentType}</span>
	</p>
	<MarkdownInline markdown={firstParagraphInline()} {skills} {technologies} class="block text-sm" />
</article>
