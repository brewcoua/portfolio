<script lang="ts">
	import { Popover } from 'bits-ui';
	import PopoverContent from '$lib/components/PopoverContent.svelte';
	import ColoredEntityBadge from '$lib/components/ColoredEntityBadge.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import { cn } from '$lib/utils';
	import { getTechnologyById } from '$lib/content/presentation';
	import type { MentionSource, Skill, Technology } from '$lib/content/types';

	let {
		techId,
		technologies = [],
		skills = [],
		mentionedIn = [],
		triggerMode = 'badge',
		class: className = ''
	} = $props<{
		techId: string;
		technologies?: Technology[];
		skills?: Skill[];
		mentionedIn?: MentionSource[];
		triggerMode?: 'badge' | 'text';
		class?: string;
	}>();

	const technology = $derived(getTechnologyById(techId, technologies));
	const label = $derived(technology?.label ?? techId);
	const relatedSkillLabels = $derived(
		(technology?.relationships ?? [])
			.filter((relationship) => relationship.type === 'skill')
			.map(
				(relationship) =>
					skills.find((skill: Skill) => skill.id === relationship.targetId)?.label ??
					relationship.targetId
			)
	);

</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			'm-0 inline cursor-pointer items-baseline border-0 bg-transparent p-0 text-inherit',
			triggerMode === 'badge' && 'inline-flex items-center'
		)}
	>
		{#if triggerMode === 'text'}
			<span class={cn('mention-link mention-static mention-popover-trigger', className)}>{label}</span>
		{:else}
			<ColoredEntityBadge label={label.toLowerCase()} brandSlug={techId} icon={technology?.icon} color={technology?.color} class={cn('cursor-pointer', className)} />
		{/if}
	</Popover.Trigger>
	<PopoverContent>
		<p class="text-sm font-bold">{label}</p>
		{#if technology?.description}
			<MarkdownInline
				markdown={technology.descriptionMarkdown}
				{skills}
				{technologies}
				class="text-muted-foreground"
			/>
		{/if}
		{#if relatedSkillLabels.length > 0}
			<div class="space-y-1">
				<p class="text-muted-foreground"># Related skills</p>
				<div class="flex flex-wrap gap-1">
					{#each relatedSkillLabels as relatedSkill}
						<span class="tag tag-skill">{relatedSkill}</span>
					{/each}
				</div>
			</div>
		{/if}
		{#if mentionedIn.length > 0}
			<div class="space-y-1">
				<p class="text-muted-foreground"># Mentioned in</p>
				<div class="flex flex-wrap gap-x-3 gap-y-1">
					{#each mentionedIn as source}
						<a class="link" href={source.href}>{source.label}</a>
					{/each}
				</div>
			</div>
		{/if}
		{#if technology?.links.length}
			<div class="space-y-1">
				<p class="text-muted-foreground"># Links</p>
				<div class="flex flex-wrap gap-x-3 gap-y-1">
					{#each technology.links as link}
						<a class="link" href={link.url} target="_blank" rel="noreferrer">{link.label ?? link.type}</a>
					{/each}
				</div>
			</div>
		{/if}
	</PopoverContent>
</Popover.Root>
