import { describe, expect, it } from 'vitest';
import { loadContent } from '$lib/server/content';
import { listCvVariants, resolveCv } from './resolve';
import { toTypst } from './typst';

describe('toTypst', () => {
	it('escapes markup characters', () => {
		expect(toTypst('C# & $5 * 2 @me <a> [x] `y` a/b _z_')).toBe(
			'C\\# & \\$5 \\* 2 \\@me \\<a\\> \\[x\\] \\`y\\` a\\/b \\_z\\_'
		);
	});

	it('converts bold and links', () => {
		expect(toTypst('**fast** [docs](https://a.dev/x)')).toBe('#strong[fast] #link("https://a.dev/x")[docs]');
	});

	it('keeps punctuation after bold and prints ~ as ∼', () => {
		expect(toTypst('**a**; ~15')).toBe('#strong[a]\\; ∼15');
	});
});

describe('resolveCv', () => {
	it('inherits from main and applies overrides', async () => {
		const content = await loadContent();
		const main = await resolveCv('main', content);
		const prosus = await resolveCv('prosus', content);
		const section = (cv: typeof main, title: string) => cv.sections.find((s) => s.title === title)!;

		expect(section(prosus, 'Education')).toEqual(section(main, 'Education'));
		expect(prosus.contact).toEqual(main.contact);
		const bullets = (cv: typeof main) => section(cv, 'Projects').entries.flatMap((e) => e.bullets);
		expect(bullets(prosus).some((b) => b.includes('agentic AI flatmate'))).toBe(true);
		expect(bullets(main).some((b) => b.includes('agentic AI flatmate'))).toBe(false);
	});

	it('resolves every variant', async () => {
		const content = await loadContent();
		for (const name of await listCvVariants()) {
			const cv = await resolveCv(name, content);
			expect(cv.skills.at(-1)?.label).toBe('Spoken Languages');
		}
	});
});
