<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { formatEntityDate } from '$lib/content/format';
	import MarkdownInline from '$lib/components/MarkdownInline.svelte';
	import type { Experience, MarkdownInlineNode, Skill, Technology } from '$lib/content/types';

	let { experience, skills = [], technologies = [] } = $props<{
		experience: Experience;
		skills?: Skill[];
		technologies?: Technology[];
	}>();

	function firstParagraphInline(): MarkdownInlineNode[] {
		const first = experience.summaryMarkdown?.blocks[0];
		return first?.type === 'paragraph' ? first.children : [];
	}
</script>

<Card.Root>
	<Card.Header class="space-y-2">
		<div class="flex flex-wrap items-start justify-between gap-2">
			<div>
				<Card.Title class="text-xl">
					<a class="hover:text-primary" href={`/experience/${experience.slug}`}>{experience.title}</a>
				</Card.Title>
				<Card.Description>{experience.organization}</Card.Description>
			</div>
			<p class="text-sm text-muted-foreground">{formatEntityDate(experience)}</p>
		</div>
		<Badge variant="outline" class="w-fit">{experience.employmentType}</Badge>
	</Card.Header>
	<Card.Content>
		<MarkdownInline markdown={firstParagraphInline()} {skills} {technologies} class="text-sm" />
	</Card.Content>
</Card.Root>
