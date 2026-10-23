<script lang="ts">
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

<section class="space-y-2">
	<h2 class="h-section">{title}</h2>
	<ul class="space-y-1 text-sm">
		{#each items as item}
			<li class="flex flex-wrap items-baseline gap-2">
				{#if item.type}
					<span class="meta" data-sigil="#">{item.type}</span>
				{/if}
				<a class="link" href={item.href}>{item.label}</a>
			</li>
		{/each}
	</ul>
</section>
