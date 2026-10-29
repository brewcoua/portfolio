<script lang="ts">
	let { data } = $props();
</script>

<section class="space-y-2">
	<h1 class="h-section text-xl">blog</h1>
	<p class="text-sm text-muted-foreground">Notes and write-ups.</p>
</section>

<section class="mt-8">
	{#if data.posts.length === 0}
		<p class="text-sm text-muted-foreground">no posts yet.</p>
	{:else}
		<ul class="space-y-6">
			{#each data.posts as post}
				<li class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
					{#if post.cover}
						<a class="figure block shrink-0 sm:w-48" href={`/blog/${post.slug}`} aria-hidden="true" tabindex="-1">
							{@html post.cover}
						</a>
					{/if}
					<div class="space-y-1">
						<p class="text-sm text-muted-foreground">{post.date} · {post.readMinutes} min read</p>
						<a class="font-bold hover:text-primary" href={`/blog/${post.slug}`}>{post.title}</a>
						<p class="text-sm text-muted-foreground">{post.summary}</p>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>
