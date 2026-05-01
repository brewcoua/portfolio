<script lang="ts">
	import OrgBrandMark from '$lib/components/OrgBrandMark.svelte';
	import RelationshipPanel from '$lib/components/RelationshipPanel.svelte';
	import TechBadge from '$lib/components/TechBadge.svelte';
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

	const orgHrefExternal = $derived(
		data.experience.website ? /^(https?:|mailto:)/.test(data.experience.website) : false
	);
</script>

<article class="space-y-6">
	<header class="space-y-2">
		<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">Experience</p>
		<div class="flex flex-wrap items-start gap-4">
			<OrgBrandMark
				logo={data.experience.logo}
				label={data.experience.organization}
				website={data.experience.website}
			/>
			<div class="min-w-0 flex-1 space-y-2">
				<h1 class="text-4xl font-semibold tracking-tight">{data.experience.title}</h1>
				<p class="text-muted-foreground">
					{#if data.experience.website}
						<a
							class="underline-offset-2 hover:text-foreground hover:underline"
							href={data.experience.website}
							target={orgHrefExternal ? '_blank' : undefined}
							rel={orgHrefExternal ? 'noopener noreferrer' : undefined}
						>
							{data.experience.organization}
						</a>
					{:else}
						{data.experience.organization}
					{/if}
					{' '}- {data.experience.location}
				</p>
				<p class="text-sm text-muted-foreground">{formatEntityDate(data.experience)}</p>
			</div>
		</div>
	</header>

	<MarkdownBlock
		markdown={data.experience.summaryMarkdown}
		skills={data.skills}
		technologies={data.technologies}
		class="max-w-3xl leading-7"
	/>

	<section>
		<h2 class="mb-3 text-2xl font-semibold">Details</h2>
		<ul class="list-disc space-y-2 pl-5">
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

	<section>
		<h2 class="mb-3 text-2xl font-semibold">Technologies</h2>
		<div class="flex flex-wrap gap-2">
			{#each data.experience.technologies as tech}
				<TechBadge
					techId={tech}
					technologies={data.technologies}
					skills={data.skills}
					class="px-3 py-1 text-sm"
				/>
			{/each}
		</div>
	</section>

	{#if data.linkedProjects.length > 0}
		<RelationshipPanel title="Linked Projects" items={linkedProjectItems} />
	{/if}
</article>
