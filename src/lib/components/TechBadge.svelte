<script lang="ts">
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import { cn } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import { getTechnologyById, getTechnologyChipStyle } from '$lib/content/presentation';
	import { Badge } from '$lib/components/ui/badge';
	import type { Skill, Technology } from '$lib/content/types';

	let { techId, technologies = [], skills = [], class: className = '' } = $props<{
		techId: string;
		technologies?: Technology[];
		skills?: Skill[];
		class?: string;
	}>();

	const technology = $derived(getTechnologyById(techId, technologies));
	const label = $derived(technology?.label ?? techId);
	const style = $derived(getTechnologyChipStyle(techId, technologies));
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
	<Popover.Trigger>
		<Badge variant="outline" class={cn('cursor-pointer px-2 py-1 text-xs', className)} style={style}>
			<SparklesIcon class="size-3.5 opacity-80" aria-hidden="true" />
			{label}
		</Badge>
	</Popover.Trigger>
	<Popover.Content class="space-y-2">
		<p class="text-sm font-medium">{label}</p>
		{#if technology?.description}
			<p class="text-xs text-muted-foreground">{technology.description}</p>
		{/if}
		{#if relatedSkillLabels.length > 0}
			<div class="space-y-1">
				<p class="text-[11px] uppercase tracking-wide text-muted-foreground">Related skills</p>
				<div class="flex flex-wrap gap-1">
					{#each relatedSkillLabels as relatedSkill}
						<Badge variant="secondary" class="text-[11px]">{relatedSkill}</Badge>
					{/each}
				</div>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
