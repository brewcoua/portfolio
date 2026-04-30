<script lang="ts">
	import ZapIcon from '@lucide/svelte/icons/zap';
	import { cn } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { getSkillById, getSkillChipStyle } from '$lib/content/presentation';
	import type { Skill, Technology } from '$lib/content/types';

	let { skillId, skills = [], technologies = [], class: className = '' } = $props<{
		skillId: string;
		skills?: Skill[];
		technologies?: Technology[];
		class?: string;
	}>();

	const skill = $derived(getSkillById(skillId, skills));
	const label = $derived(skill?.label ?? skillId);
	const style = $derived(getSkillChipStyle(skillId, skills));
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
	<Popover.Trigger>
		<Badge variant="outline" class={cn('cursor-pointer px-2 py-1 text-xs', className)} style={style}>
			<ZapIcon class="size-3.5 opacity-80" aria-hidden="true" />
			{label}
		</Badge>
	</Popover.Trigger>
	<Popover.Content class="space-y-2">
		<p class="text-sm font-medium">{label}</p>
		{#if skill?.description}
			<p class="text-xs text-muted-foreground">{skill.description}</p>
		{/if}
		{#if relatedTechnologyLabels.length > 0}
			<div class="space-y-1">
				<p class="text-[11px] uppercase tracking-wide text-muted-foreground">Related technologies</p>
				<div class="flex flex-wrap gap-1">
					{#each relatedTechnologyLabels as relatedTechnology}
						<Badge variant="secondary" class="text-[11px]">{relatedTechnology}</Badge>
					{/each}
				</div>
			</div>
		{/if}
		{#if skill?.links.length}
			<div class="space-y-1">
				<p class="text-[11px] uppercase tracking-wide text-muted-foreground">Links</p>
				<div class="flex flex-wrap gap-1.5">
					{#each skill.links as link}
						<Button href={link.url} variant="outline" size="xs" target="_blank" rel="noreferrer">
							{link.label ?? link.type}
						</Button>
					{/each}
				</div>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
