<script lang="ts">
	import { Popover } from 'bits-ui';
	import PopoverContent from '$lib/components/PopoverContent.svelte';
	import ColoredEntityBadge from '$lib/components/ColoredEntityBadge.svelte';
	import { cn } from '$lib/utils';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import { getSkillById } from '$lib/content/presentation';
	import type { MentionSource, Skill, Technology } from '$lib/content/types';

	let {
		skillId,
		skills = [],
		technologies = [],
		mentionedIn = [],
		triggerMode = 'badge',
		class: className = ''
	} = $props<{
		skillId: string;
		skills?: Skill[];
		technologies?: Technology[];
		mentionedIn?: MentionSource[];
		triggerMode?: 'badge' | 'text';
		class?: string;
	}>();

	const skill = $derived(getSkillById(skillId, skills));
	const label = $derived(skill?.label ?? skillId);
	const relatedTechnologyLabels = $derived(
		(skill?.relationships ?? [])
			.filter((relationship) => relationship.type === 'technology')
			.map(
				(relationship) =>
					technologies.find((technology: Technology) => technology.id === relationship.targetId)?.label ??
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
			<ColoredEntityBadge label={label.toLowerCase()} icon={skill?.icon} color={skill?.color} kind="skill" class={cn('cursor-pointer', className)} />
		{/if}
	</Popover.Trigger><PopoverContent>
		<p class="text-sm font-bold">{label}</p>
		{#if skill?.description}
			<MarkdownInline
				markdown={skill.descriptionMarkdown}
				{skills}
				{technologies}
				class="text-muted-foreground"
			/>
		{/if}
		{#if relatedTechnologyLabels.length > 0}
			<div class="space-y-1">
				<p class="text-muted-foreground"># Related technologies</p>
				<div class="flex flex-wrap gap-1">
					{#each relatedTechnologyLabels as relatedTechnology}
						<span class="tag">{relatedTechnology}</span>
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
		{#if skill?.links.length}
			<div class="space-y-1">
				<p class="text-muted-foreground"># Links</p>
				<div class="flex flex-wrap gap-x-3 gap-y-1">
					{#each skill.links as link}
						<a class="link" href={link.url} target="_blank" rel="noreferrer">{link.label ?? link.type}</a>
					{/each}
				</div>
			</div>
		{/if}
	</PopoverContent>
</Popover.Root>
