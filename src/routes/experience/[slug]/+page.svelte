<script lang="ts">
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import SkillBadge from '$lib/components/SkillBadge.svelte';
	import OrgLogo from '$lib/components/OrgLogo.svelte';
	import OrgName from '$lib/components/OrgName.svelte';
	import MarkdownBlock from '$lib/components/MarkdownBlock.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import { formatEntityDate } from '$lib/content/format';

	let { data } = $props();

	const linkedProjectItems = $derived(
		data.linkedProjects.map((project) => ({
			label: project.title,
			href: `/projects/${project.slug}`,
			type: 'project'
		}))
	);
</script>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm text-muted-foreground"># experience</p>
		<div class="flex flex-wrap items-start gap-4">
			<OrgLogo src={data.experience.logo} size={32} class="mt-1" />
			<div class="min-w-0 flex-1 space-y-2">
				<h1 class="text-xl font-bold leading-snug">{data.experience.title}</h1>
				<p class="flex flex-wrap gap-x-2 text-muted-foreground">
					<OrgName name={data.experience.organization} short={data.experience.organizationShort} formerly={data.experience.organizationFormerly} href={data.experience.website} />
					<span>- {data.experience.location}</span>
				</p>
				<p class="text-sm text-muted-foreground">{formatEntityDate(data.experience)}</p>
			</div>
		</div>
	</header>

	<MarkdownBlock
		markdown={data.experience.summaryMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		
	/>

	<section>
		<h2 class="h-section mb-3">Details</h2>
		<ul class="list-disc marker:text-muted-foreground space-y-2 pl-5">
			{#each data.experience.details as _, detailIndex}
				<li>
					<MarkdownInline
						markdown={data.experience.detailsMarkdown?.[detailIndex]}
						skills={data.skills}
						technologies={data.technologies}
					/>
				</li>
			{/each}
		</ul>
	</section>

	{#if data.experience.description.trim()}
		<hr class="border-t-2 border-dashed border-muted-foreground/40" />
		<MarkdownBlock
			markdown={data.experience.descriptionMarkdown}
			skills={data.skills}
			technologies={data.technologies}
		/>
	{/if}

	<section>
		<h2 class="h-section mb-3">Technologies</h2>
		<div class="flex flex-wrap gap-2">
			{#each data.experience.technologies as tech}
				<TechBadge
					techId={tech}
					technologies={data.technologies}
					skills={data.skills}
				/>
			{/each}
		</div>
	</section>

	{#if data.experience.skills.length > 0}
		<section>
			<h2 class="h-section mb-3">Skills</h2>
			<div class="flex flex-wrap gap-x-2 gap-y-1">
				{#each data.experience.skills as skillId}
					<SkillBadge {skillId} skills={data.skills} technologies={data.technologies} />
				{/each}
			</div>
		</section>
	{/if}

	{#if data.linkedProjects.length > 0}
		<RelationshipPanel title="Linked Projects" items={linkedProjectItems} />
	{/if}
</article>
