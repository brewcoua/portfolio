import { env } from '$env/dynamic/private';
import { projectSource, splitFrontmatter } from '$lib/server/content';

// Bundled at build time: the Node server has no content/ directory to read.
const files = import.meta.glob<string>('/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

const sources = Object.entries(files).flatMap(([file, raw]) => {
	const slug = file.split('/').pop()!.replace(/\.md$/, '');
	const data = splitFrontmatter(raw, file).data as Record<string, unknown>;
	const source = projectSource(data, file);
	return source ? [{ slug, ...source }] : [];
});

/** One GitHub call per tick keeps us well under the unauthenticated 60/hour limit. */
const TICK_MS = 90_000;

/** Commits on the default branch since each project's `commit`, by slug; absent until first checked. */
const aheadBy = new Map<string, number>();
let next = 0;
let timer: ReturnType<typeof setInterval> | undefined;

async function refreshOne() {
	const { slug, repo, commit } = sources[next++ % sources.length];
	try {
		const res = await fetch(`https://api.github.com/repos/${repo}/compare/${commit}...HEAD`, {
			headers: {
				accept: 'application/vnd.github+json',
				...(env.GITHUB_TOKEN && { authorization: `Bearer ${env.GITHUB_TOKEN}` })
			}
		});
		if (!res.ok) throw new Error(`GitHub ${res.status}`);
		aheadBy.set(slug, (await res.json()).ahead_by);
	} catch (error) {
		console.error(`repo status for ${repo}:`, error);
	}
}

/** Starts the round-robin refresh on first call; returns whatever has been checked so far. */
export function repoStatuses(): Record<string, number> {
	if (!timer && sources.length > 0) {
		timer = setInterval(refreshOne, TICK_MS);
		void refreshOne();
	}
	return Object.fromEntries(aheadBy);
}
