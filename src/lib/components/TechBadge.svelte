<script lang="ts">
	import ColoredEntityBadge from '$lib/components/ColoredEntityBadge.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { getTechnologyById, getTechnologyChipStyle } from '$lib/content/presentation';
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
	<Popover.Trigger
		class={cn(
			'inline items-baseline border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
			triggerMode === 'badge' && 'inline-flex items-center'
		)}
	>
		{#if triggerMode === 'text'}
			<span class={cn('mention-link mention-static mention-popover-trigger', className)}>{label}</span>
		{:else}
			<ColoredEntityBadge {label} {style} icon={technology?.icon} class={cn('cursor-pointer', className)} />
		{/if}
	</Popover.Trigger>
	<Popover.Content class="space-y-2">
		<p class="text-sm font-medium">{label}</p>
		{#if technology?.description}
			<MarkdownInline
				markdown={technology.descriptionMarkdown}
				{skills}
				{technologies}
				class="text-xs text-muted-foreground"
			/>
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
		{#if technology?.links.length}
			<div class="space-y-1">
				<p class="text-[11px] uppercase tracking-wide text-muted-foreground">Links</p>
				<div class="flex flex-wrap gap-1.5">
					{#each technology.links as link}
						<Button href={link.url} variant="outline" size="xs" target="_blank" rel="noreferrer">
							{link.label ?? link.type}
						</Button>
					{/each}
				</div>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
