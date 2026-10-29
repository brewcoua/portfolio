/** Shared by every OutdatedIcon on the page so they fetch `/api/repos` once, not once each. */
export const repoStatus = $state<{ aheadBy: Record<string, number> }>({ aheadBy: {} });

let fetched = false;

export function loadRepoStatus() {
	if (fetched) return;
	fetched = true;
	fetch('/api/repos')
		.then((res) => (res.ok ? res.json() : {}))
		.then((aheadBy) => (repoStatus.aheadBy = aheadBy))
		.catch(() => {});
}
