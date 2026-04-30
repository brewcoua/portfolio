<script lang="ts">
	import ColoredEntityBadge from '$lib/components/ColoredEntityBadge.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { getRoleById, getRoleChipStyle } from '$lib/content/presentation';
	import type { Role } from '$lib/content/types';

	let { roleId, roles = [], class: className = '' } = $props<{
		roleId: string;
		roles?: Role[];
		class?: string;
	}>();

	const role = $derived(getRoleById(roleId, roles));
	const label = $derived(role?.label ?? roleId);
	const style = $derived(getRoleChipStyle(roleId, roles));
</script>

<Popover.Root>
	<Popover.Trigger>
		<ColoredEntityBadge {label} {style} icon={role?.icon} class={cn('cursor-pointer', className)} />
	</Popover.Trigger>
	<Popover.Content class="space-y-2">
		<p class="text-sm font-medium">{label}</p>
		{#if role?.description}
			<MarkdownInline markdown={role.descriptionMarkdown} class="text-xs text-muted-foreground" />
		{/if}
	</Popover.Content>
</Popover.Root>
