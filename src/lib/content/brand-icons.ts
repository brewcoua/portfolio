import {
	siGithub,
	siCodeberg,
	siGitlab,
	siRust,
	siPython,
	siReact,
	siDocker,
	siKubernetes,
	siTypescript,
	siJavascript,
	siPostgresql,
	siRedis,
	siMongodb,
	siRabbitmq,
	siNestjs,
	siNextdotjs,
	siFastapi,
	siAngular,
	siLinux,
	siGnubash,
	siPytorch,
	siTensorflow,
	siExpress,
	siC,
	siOpenjdk,
	siTokio,
	siActix,
	siGooglecloud,
	siGooglebigquery,
	siJupyter,
	siPandas,
	siHuggingface,
	siAnsible,
	siOpentofu,
	siFlux,
	siTrivy,
	siScikitlearn
} from 'simple-icons';

export type BrandIcon = { title: string; hex: string; path: string };

/**
 * Curated brand marks (Simple Icons) keyed by content slug. Brands without a
 * Simple Icon (linkedin, playwright, aws, …) fall back to a Lucide glyph via
 * the `icon` field. Explicit named imports keep the bundle tree-shakeable.
 */
const BRAND_BY_SLUG: Record<string, { title: string; hex: string; path: string }> = {
	github: siGithub,
	codeberg: siCodeberg,
	gitlab: siGitlab,
	rust: siRust,
	python: siPython,
	react: siReact,
	docker: siDocker,
	kubernetes: siKubernetes,
	typescript: siTypescript,
	javascript: siJavascript,
	postgresql: siPostgresql,
	redis: siRedis,
	mongodb: siMongodb,
	rabbitmq: siRabbitmq,
	nestjs: siNestjs,
	nextjs: siNextdotjs,
	fastapi: siFastapi,
	angular: siAngular,
	linux: siLinux,
	bash: siGnubash,
	pytorch: siPytorch,
	tensorflow: siTensorflow,
	express: siExpress,
	c: siC,
	java: siOpenjdk,
	tokio: siTokio,
	actix: siActix,
	gcp: siGooglecloud,
	bigquery: siGooglebigquery,
	jupyter: siJupyter,
	pandas: siPandas,
	huggingface: siHuggingface,
	ansible: siAnsible,
	opentofu: siOpentofu,
	flux: siFlux,
	trivy: siTrivy,
	'scikit-learn': siScikitlearn
};

/** Brands no longer shipped by Simple Icons / Lucide, kept as manual marks. */
const MANUAL_BRANDS: Record<string, BrandIcon> = {
	linkedin: {
		title: 'LinkedIn',
		hex: '#0A66C2',
		path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'
	},
	// Devicon "playwright-plain" (MIT), scaled from a 128 to a 24 viewBox.
	playwright: {
		title: 'Playwright',
		hex: '#2EAD33',
		path: 'M13.516 16.15l-0.111-0.027c-2.461-0.721-2.841-2.683-2.841-2.684l3.409 0.953L15.778 7.457l-0.022-0.006c-2.214-0.593-3.683-1.63-4.264-2.117-0.825-0.691-1.188-1.171-1.545-0.445-0.315 0.641-0.719 1.683-1.11 3.143-0.847 3.161-1.48 9.83 3.755 11.234l0.107 0.024z m-3.526-5.785s0.825-1.283 2.224-0.885c1.4 0.398 1.508 1.946 1.508 1.946z m-1.597 4.397L5.96 15.452s0.264-1.505 2.057-2.102l-1.378-5.17-0.119 0.036c-1.708 0.461-3.089 0.338-3.666 0.239-0.817-0.141-1.244-0.32-1.204 0.301 0.035 0.548 0.165 1.398 0.465 2.52 0.647 2.43 2.785 7.113 6.826 6.024l0.119-0.037zM3.665 11.309l2.872-0.756s-0.084 1.105-1.16 1.388c-1.077 0.283-1.712-0.632-1.712-0.632z m16.842-3.558c-0.746 0.131-2.537 0.294-4.75-0.3-2.214-0.593-3.683-1.63-4.265-2.117-0.825-0.691-1.188-1.171-1.545-0.445-0.316 0.641-0.719 1.683-1.11 3.143-0.847 3.161-1.48 9.83 3.755 11.234 5.233 1.402 8.02-4.691 8.867-7.852 0.391-1.459 0.562-2.564 0.609-3.276 0.054-0.807-0.501-0.573-1.561-0.387zM9.99 10.365s0.825-1.283 2.224-0.885c1.4 0.398 1.508 1.946 1.509 1.946z m3.415 5.758c-2.461-0.721-2.841-2.683-2.84-2.684l6.611 1.849c0 0-1.334 1.547-3.771 0.835m2.338-4.033s0.824-1.282 2.222-0.884c1.399 0.398 1.509 1.946 1.509 1.946zM9.7 15.738v-1.346l-3.74 1.06s0.276-1.606 2.227-2.159c0.592-0.168 1.096-0.167 1.513-0.086V7.687h1.872c-0.204-0.63-0.401-1.115-0.566-1.452-0.274-0.558-0.555-0.188-1.193 0.345-0.449 0.375-1.584 1.176-3.293 1.636-1.708 0.461-3.089 0.338-3.665 0.239-0.817-0.141-1.244-0.32-1.205 0.301 0.035 0.548 0.165 1.398 0.465 2.52 0.647 2.43 2.785 7.113 6.826 6.024 1.055-0.284 1.801-0.847 2.317-1.563h-1.558Zm-6.035-4.429l2.872-0.756s-0.084 1.105-1.16 1.388c-1.077 0.283-1.712-0.632-1.712-0.632z'
	}
};

/** Resolve a brand mark by content slug or `type/slug` path. Null if none. */
export function getBrandIcon(slug: string | undefined): BrandIcon | null {
	if (!slug) return null;
	const key = (slug.includes('/') ? (slug.split('/').pop() ?? slug) : slug).toLowerCase();
	if (MANUAL_BRANDS[key]) return MANUAL_BRANDS[key];
	const icon = BRAND_BY_SLUG[key];
	if (!icon) return null;
	return { title: icon.title, hex: `#${icon.hex}`, path: icon.path };
}
