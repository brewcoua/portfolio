import { describe, expect, it } from 'vitest';
import { loadContent } from '$lib/server/content';
import {
	markdownDocToPlainText,
	markdownInlineToPlainText,
	renderMarkdownDoc,
	renderMarkdownInline
} from '$lib/server/markdown/index';
import type { MentionDictionaries } from '$lib/server/markdown/index';

describe('custom markdown pipeline', () => {
	it('parses core blocks and inline styles', () => {
		const doc = renderMarkdownDoc('## Heading\n\n- **one**\n- `two`');
		expect(doc.blocks[0]?.type).toBe('heading');
		expect(doc.blocks[1]?.type).toBe('list');
	});

	it('supports inline markdown rendering', () => {
		const inline = renderMarkdownInline('**Bold** and [link](https://example.com)');
		expect(inline.length).toBeGreaterThan(0);
		expect(markdownInlineToPlainText(inline)).toContain('Bold');
	});

	it('parses markdown links after trailing newline (paragraph split)', () => {
		const withNewlines = '[test](https://example.com)\n\n';
		const inline = renderMarkdownInline(withNewlines);
		const hasLink = inline.some((node) => node.type === 'link');
		expect(hasLink).toBe(true);
	});

	it('parses society-style link plus suffix text', () => {
		const inline = renderMarkdownInline(
			"[W.I.S.V. 'Christiaan Huygens'](https://ch.tudelft.nl) — ComMA Committee Secretary"
		);
		const linkNode = inline.find((node) => node.type === 'link');
		expect(linkNode?.type).toBe('link');
		expect((linkNode as { href?: string })?.href).toBe('https://ch.tudelft.nl');
	});

	it('resolves [[wikilink]] scheme mentions to links and popovers', () => {
		const mentions: MentionDictionaries = new Map([
			['experience/labri', { kind: 'experience', href: '/experience/labri' }],
			[
				'technologies/docker',
				{ kind: 'technology', entityId: 'technologies/docker', title: 'Docker', body: 'Container platform' }
			]
		]);

		const doc = renderMarkdownDoc(
			'WebWisp uses [Docker](wikilink:technologies/docker) and [this experience](wikilink:experience/labri).',
			{ mentions }
		);
		const mention = doc.blocks[0]?.type === 'paragraph'
			? doc.blocks[0].children.filter((n) => n.type === 'mention')
			: [];
		expect(mention.length).toBe(2);
		const text = markdownDocToPlainText(doc);
		expect(text).toContain('Docker');
		expect(text).toContain('this experience');
	});

	it('creates markdown fields during content load', async () => {
		const content = await loadContent();
		expect(content.profile.summaryMarkdown?.blocks.length).toBeGreaterThan(0);
		expect(content.projects[0]?.descriptionMarkdown?.blocks.length).toBeGreaterThan(0);
		expect(content.experience[0]?.summaryMarkdown?.blocks.length).toBeGreaterThan(0);

		const msc = content.education.find((e) => e.id === 'education/tud-msc-cs');
		const societyNodes = msc?.societiesMarkdown?.[0];
		expect(societyNodes?.some((n) => n.type === 'link')).toBe(true);
	});
});
