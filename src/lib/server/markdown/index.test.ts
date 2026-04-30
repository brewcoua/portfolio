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

	it('resolves @token links and auto mentions', () => {
		const mentions: MentionDictionaries = {
			tokenToLink: new Map([['exp-labri-research-intern', { kind: 'experience', href: '/experience/labri' }]]),
			labelToLink: new Map([['webwisp', { kind: 'project', href: '/projects/webwisp' }]]),
			labelToPopover: new Map([
				[
					'docker',
					{ kind: 'technology', entityId: 'tech-docker', title: 'Docker', body: 'Container platform' }
				]
			])
		};

		const doc = renderMarkdownDoc('WebWisp uses Docker and [this experience](@exp-labri-research-intern).', {
			mentions
		});
		const text = markdownDocToPlainText(doc);
		expect(text).toContain('WebWisp');
		expect(text).toContain('Docker');
		expect(text).toContain('this experience');
	});

	it('creates markdown fields during content load', async () => {
		const content = await loadContent();
		expect(content.profile.summaryMarkdown?.blocks.length).toBeGreaterThan(0);
		expect(content.projects[0]?.descriptionMarkdown?.blocks.length).toBeGreaterThan(0);
		expect(content.experience[0]?.summaryMarkdown?.blocks.length).toBeGreaterThan(0);
	});
});
