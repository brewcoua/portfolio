<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	type RelationshipItem = {
		label: string;
		href: string;
		type?: string;
	};

	let { title, items } = $props<{
		title: string;
		items: RelationshipItem[];
	}>();
</script>

<section class="space-y-3">
	<h2 class="text-2xl font-semibold">{title}</h2>
	<ul class="space-y-2">
		{#each items as item}
			<li class="flex flex-wrap items-center gap-2">
				{#if item.type}
					<Badge variant="outline" class="text-xs">{item.type}</Badge>
				{/if}
				<Button href={item.href} variant="link" size="sm">{item.label}</Button>
			</li>
		{/each}
	</ul>
</section>
