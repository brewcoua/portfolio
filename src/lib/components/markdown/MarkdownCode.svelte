<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import type { CodeToken } from '$lib/content/types';

	let {
		value,
		inline = false,
		language,
		title,
		lines
	}: {
		value: string;
		inline?: boolean;
		language?: string;
		title?: string;
		lines?: CodeToken[][];
	} = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(value);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

{#if inline}
	<code>{value}</code>
{:else}
	<div class="code-block">
		<div class="code-header">
			<span>{title ?? language ?? 'text'}</span>
			<button type="button" onclick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>
				{#if copied}<CheckIcon size={14} />{:else}<CopyIcon size={14} />{/if}
			</button>
		</div>
		<pre><code class={language ? `language-${language}` : undefined}
				>{#if lines}{#each lines as line, i}{#each line as token}<span
								style:color={token.color}
								style:font-style={token.italic ? 'italic' : undefined}>{token.content}</span
							>{/each}{#if i < lines.length - 1}{'\n'}{/if}{/each}{:else}{value}{/if}</code
			></pre>
	</div>
{/if}
