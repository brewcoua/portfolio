import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { cvVariant, parseWikilink, type CvBlock, type CvVariant } from '$lib/content/schema';
import { formatEntityDate } from '$lib/content/format';
import type { Experience, PortfolioContent, Project } from '$lib/content/types';
import { toTypst } from './typst';

const CV_DIR = join(process.cwd(), 'content', 'cv');

/** One CV row: top/bottom, left/right cells (Typst markup) plus bullets. */
type CvEntry = { tl: string; tr: string; bl: string | null; br: string | null; bullets: string[] };

export type CvData = {
	name: string;
	contact: string[][];
	sections: { title: string; entries: CvEntry[] }[];
	skills: { label: string; items: string }[];
};

export async function listCvVariants(): Promise<string[]> {
	return (await readdir(CV_DIR)).filter((file) => file.endsWith('.yaml')).map((file) => file.slice(0, -5));
}

async function readVariant(name: string, seen: string[] = []): Promise<CvVariant> {
	if (seen.includes(name)) throw new Error(`cv/${name}: circular extends (${[...seen, name].join(' -> ')})`);
	const result = cvVariant.safeParse(parse(await readFile(join(CV_DIR, `${name}.yaml`), 'utf-8')));
	if (!result.success) {
		throw new Error(`cv/${name}: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
	}
	const variant = result.data;
	if (!variant.extends) return variant;
	const base = await readVariant(variant.extends, [...seen, name]);
	return { ...base, ...variant, overrides: { ...base.overrides, ...variant.overrides } };
}

const display = (url: string) => url.replace(/^(https?:\/\/|mailto:)/, '').replace(/\/$/, '');
const link = (url: string) => `#link("${url}")[${toTypst(display(url))}]`;
const dateRange = (entity: Parameters<typeof formatEntityDate>[0]) => formatEntityDate(entity).replace(' - ', ' -- ');

export async function resolveCv(name: string, content: PortfolioContent): Promise<CvData> {
	const variant = await readVariant(name);
	const { profile, site } = content;

	const overrides = new Map(Object.entries(variant.overrides).map(([key, value]) => [targetOf(key, `cv/${name}`), value]));
	function pick<T extends { id: string; cv?: CvBlock }>(refs: string[] | undefined, pool: T[]) {
		return (refs ?? []).map((ref) => {
			const id = targetOf(ref, `cv/${name}`);
			const entity = pool.find((item) => item.id === id);
			if (!entity) throw new Error(`cv/${name}: unresolved ${ref}`);
			return { entity, cv: { bullets: [], ...entity.cv, ...overrides.get(id) } as CvBlock };
		});
	}
	const bullets = (cv: CvBlock) => cv.bullets.map(toTypst);

	const education = pick(variant.education, content.education).map(({ entity: e, cv }) => ({
		tl: `#strong[${toTypst(cv.org ?? orgName(e.institution, e.institutionShort))}]`,
		tr: toTypst(cv.location ?? e.location),
		bl: toTypst(cv.title ?? e.degree),
		br: toTypst(cv.date ?? dateRange(e)),
		bullets: bullets(cv)
	}));
	const experience = pick(variant.experience, content.experience).map(({ entity: e, cv }) => ({
		tl: `#strong[${toTypst(cv.title ?? e.title)}]`,
		tr: toTypst(cv.date ?? dateRange(e)),
		bl: toTypst(cv.org ?? experienceOrg(e)),
		br: toTypst(cv.location ?? e.location),
		bullets: (cv.bullets.length > 0 ? cv.bullets : e.details).map(toTypst)
	}));
	const projects = pick(variant.projects, content.projects).map(({ entity: p, cv }) => {
		const stack = cv.stack ?? p.technologies.slice(0, 4).map((id) => techLabel(id, content));
		const url = cv.link ?? defaultProjectLink(p);
		return {
			tl: [`#strong[${toTypst(cv.title ?? p.title)}]`, `#emph[${toTypst(stack.join(', '))}]`, cv.context && toTypst(cv.context)]
				.filter(Boolean)
				.join(' | '),
			tr: url ? link(url) + (cv.linkNote ? ` ${toTypst(cv.linkNote)}` : '') : '',
			bl: null,
			br: null,
			bullets: bullets(cv)
		};
	});

	const linkOf = (type: string) => profile.links.find((item) => item.type === type)?.url;
	const contact = [
		[variant.header?.location ?? profile.location, variant.header?.phone, linkOf('email')],
		[linkOf('linkedin'), linkOf('github'), site.baseUrl]
	].map((line) =>
		line.filter((part): part is string => Boolean(part)).map((part) => (/^(https?:|mailto:)/.test(part) ? link(part) : toTypst(part)))
	);

	const skills = (variant.skills ?? []).map((group) => ({
		label: toTypst(group.label),
		items: toTypst(group.items.map((item) => (parseWikilink(item) ? techLabel(targetOf(item, `cv/${name}`), content) : item)).join(', '))
	}));
	if (profile.languages.length > 0) {
		skills.push({
			label: 'Spoken Languages',
			items: toTypst(profile.languages.map((l) => `${l.name} (${l.level})`).join(', '))
		});
	}

	return {
		name: profile.name,
		contact,
		sections: [
			{ title: 'Education', entries: education },
			{ title: 'Experience', entries: experience },
			{ title: 'Projects', entries: projects }
		].filter((section) => section.entries.length > 0),
		skills
	};
}

function targetOf(ref: string, label: string): string {
	const target = parseWikilink(ref)?.target;
	if (!target?.includes('/')) throw new Error(`${label}: use a full [[folder/slug]] reference, got ${ref}`);
	return target;
}

function techLabel(id: string, content: PortfolioContent): string {
	const tech = content.technologies.find((item) => item.id === id);
	if (!tech) throw new Error(`cv: unknown technology ${id}`);
	return tech.label;
}

const orgName = (name: string, short?: string) => (short ? `${name} (${short})` : name);

function experienceOrg(e: Experience): string {
	const name = e.organizationShort ? `${e.organizationShort} (${e.organization})` : e.organization;
	return e.organizationFormerly ? `${name} (prev. ${e.organizationFormerly})` : name;
}

function defaultProjectLink(p: Project): string | undefined {
	return (p.links.find((item) => item.type === 'github') ?? p.links[0])?.url;
}
