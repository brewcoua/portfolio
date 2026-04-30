<script lang="ts">
	import ZapIcon from '@lucide/svelte/icons/zap';
	import { cn } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { getSkillById, getSkillChipStyle } from '$lib/content/presentation';
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

	function fadeOnOverflow(node: HTMLSpanElement) {
		const update = () => {
			node.dataset.overflowing = node.scrollWidth > node.clientWidth + 1 ? 'true' : 'false';
		};
		const observer = new ResizeObserver(update);
		observer.observe(node);
		queueMicrotask(update);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<Popover.Root>
	<Popover.Trigger>
		{#if triggerMode === 'text'}
			<span class={cn('mention-link mention-static mention-popover-trigger', className)}>
				{label}
			</span>
		{:else}
			<Badge variant="outline" class={cn('cursor-pointer px-2 py-1 text-xs', className)} style={style}>
				<ZapIcon class="size-3.5 opacity-80" aria-hidden="true" />
				{label}
			</Badge>
		{/if}
	</Popover.Trigger>
	<Popover.Content class="space-y-2">
		<p class="text-sm font-medium">{label}</p>
		{#if skill?.description}
			<MarkdownInline
				markdown={skill.descriptionMarkdown}
				{skills}
				{technologies}
				class="text-xs text-muted-foreground"
			/>
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
		{#if mentionedIn.length > 0}
			<div class="space-y-1">
				<p class="text-[11px] uppercase tracking-wide text-muted-foreground">Mentioned in</p>
				<div class="flex flex-wrap gap-1.5">
					{#each mentionedIn as source}
						<Button
							href={source.href}
							variant="outline"
							size="xs"
							class="max-w-full min-w-0 justify-start overflow-hidden"
							title={source.label}
						>
							<span
								use:fadeOnOverflow
								class="block max-w-full min-w-0 overflow-hidden whitespace-nowrap [mask-image:none] data-[overflowing=true]:[mask-image:linear-gradient(to_right,black_82%,transparent)]"
							>
								{source.label}
							</span>
						</Button>
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
