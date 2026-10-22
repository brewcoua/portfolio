<script lang="ts">
	import { Popover } from 'bits-ui';
	import ColoredEntityBadge from '$lib/components/ColoredEntityBadge.svelte';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import PopoverContent from '$lib/components/PopoverContent.svelte';
	import { cn } from '$lib/utils';
	import { getRoleById } from '$lib/content/presentation';
	import type { Role } from '$lib/content/types';

	let { roleId, roles = [], class: className = '' } = $props<{
		roleId: string;
		roles?: Role[];
		class?: string;
	}>();

	const role = $derived(getRoleById(roleId, roles));
	const label = $derived(role?.label ?? roleId);
</script>

<Popover.Root>
	<Popover.Trigger class="cursor-pointer">
		<ColoredEntityBadge label={label.toLowerCase()} icon={role?.icon} class={cn('cursor-pointer', className)} />
	</Popover.Trigger>
	<PopoverContent>
		<p class="text-sm font-bold">{label}</p>
		{#if role?.description}
			<MarkdownInline markdown={role.descriptionMarkdown} class="text-muted-foreground" />
		{/if}
	</PopoverContent>
</Popover.Root>
