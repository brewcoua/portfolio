import { describe, expect, it } from 'vitest';
import { parseBibtex } from '$lib/server/bibtex';
import { renderMarkdownDoc } from '$lib/server/markdown/index';
import { CITE_NARRATIVE_SCHEME, CITE_SCHEME } from '$lib/server/markdown/mentions';
import { citeLabel, formatBibliography } from './apa';

const BIB = String.raw`
@article{shao2024storm,
  title = {Assisting in Writing {Wikipedia}-like Articles From Scratch with Large Language Models},
  author = {Shao, Yijia and Jiang, Yucheng and Lam, Monica S.},
  journal = {arXiv preprint arXiv:2402.14207},
  year = {2024},
  doi = {10.48550/arXiv.2402.14207}
}
@article{solo2024a,
  title = {Zeta Results},
  author = {M{\"u}ller, Jos\'{e}},
  journal = {Journal of Things},
  volume = {12}, number = {3}, pages = {1--10},
  year = {2024}
}
@inproceedings{solo2024b,
  title = "Alpha Results",
  author = "José Müller",
  booktitle = {Proceedings of Stuff},
  year = 2024
}
@misc{pair2020,
  title = {Language Models are Few-Shot Learners},
  author = {Brown, Tom B. and Kung-Hsiang Huang},
  year = {2020},
  eprint = {2005.14165},
  archivePrefix = {arXiv}
}
`;

const refs = formatBibliography(parseBibtex(BIB));
const get = (key: string) => refs.get(key)!;

describe('APA 7 references', () => {
	it('parses accents, both name orders and bare values', () => {
		expect(get('solo2024a').authors).toBe('Müller, J.');
		expect(get('solo2024b').authors).toBe('Müller, J.');
		expect(get('pair2020').authors).toBe('Brown, T. B., & Huang, K.-H.');
	});

	it('builds in-text labels for one, two and three or more authors', () => {
		expect(citeLabel([get('shao2024storm')])).toBe('(Shao et al., 2024)');
		expect(citeLabel([get('pair2020')])).toBe('(Brown & Huang, 2020)');
		expect(citeLabel([get('pair2020')], true)).toBe('Brown and Huang (2020)');
	});

	it('suffixes same author and year by title, and sorts grouped citations', () => {
		expect(get('solo2024b').year).toBe('2024a');
		expect(get('solo2024a').year).toBe('2024b');
		expect(citeLabel([get('solo2024a'), get('pair2020')])).toBe('(Brown & Huang, 2020; Müller, 2024b)');
	});

	it('formats preprints, articles and proceedings', () => {
		expect(get('shao2024storm')).toMatchObject({
			title: 'Assisting in writing Wikipedia-like articles from scratch with large language models',
			titleItalic: true,
			descriptor: '(arXiv:2402.14207)',
			publisher: 'arXiv',
			href: 'https://doi.org/10.48550/arXiv.2402.14207'
		});
		expect(get('pair2020')).toMatchObject({ title: 'Language models are few-shot learners', descriptor: '(arXiv:2005.14165)' });
		expect(get('solo2024a')).toMatchObject({ titleItalic: false, source: 'Journal of Things', sourceDetails: ', 12(3), 1–10' });
		expect(get('solo2024b')).toMatchObject({ source: 'Proceedings of Stuff', sourceDetails: undefined });
	});

	it('lists 21+ authors as the first 19, an ellipsis and the last', () => {
		const authors = Array.from({ length: 22 }, (_, i) => `Author${i}, A.`).join(' and ');
		const [entry] = parseBibtex(`@article{many, title={T}, author={${authors}}, year={2020}}`);
		const listed = formatBibliography([entry]).get('many')!.authors;
		expect(listed).toContain('Author18, A., . . . Author21, A.');
		expect(listed).not.toContain('Author19');
	});
});

describe('citation nodes', () => {
	it('turns cite links into citation nodes and leaves other links alone', () => {
		const doc = renderMarkdownDoc(
			`See [cite](${CITE_SCHEME}shao2024storm;pair2020), [cite](${CITE_NARRATIVE_SCHEME}pair2020) and [x](https://a.b).`,
			{ references: refs }
		);
		const [paragraph] = doc.blocks;
		if (paragraph.type !== 'paragraph') throw new Error('expected paragraph');
		const citations = paragraph.children.filter((node) => node.type === 'citation');
		expect(citations.map((node) => node.type === 'citation' && node.label)).toEqual([
			'(Brown & Huang, 2020; Shao et al., 2024)',
			'Brown and Huang (2020)'
		]);
		expect(paragraph.children.some((node) => node.type === 'link')).toBe(true);
	});
});
