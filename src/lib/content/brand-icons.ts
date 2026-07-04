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
	siHuggingface
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
	huggingface: siHuggingface
};

/** Brands no longer shipped by Simple Icons / Lucide, kept as manual marks. */
const MANUAL_BRANDS: Record<string, BrandIcon> = {
	linkedin: {
		title: 'LinkedIn',
		hex: '#0A66C2',
		path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'
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
