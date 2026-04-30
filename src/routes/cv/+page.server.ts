import { loadContent } from '$lib/server/content';

export async function load() {
	const { site } = await loadContent();
	const cvUrl = site.cv?.cvPdfUrl?.trim();
	return {
		cv: site.cv,
		hasValidCvUrl: Boolean(cvUrl && cvUrl.startsWith('https://'))
	};
}
