/** APA 7 formatting for BibTeX entries: in-text labels and reference-list entries. */

export type BibPerson = { family: string; given: string };

export type BibEntry = {
	key: string;
	type: string;
	authors: BibPerson[];
	/** Title with `{…}`-protected spans kept as-is by sentence casing, braces already removed. */
	title: string;
	/** Words of `title` that were brace-protected in the source. */
	protectedWords: string[];
	year: string;
	fields: Record<string, string>;
};

export type Reference = {
	key: string;
	/** In-text author part: "Shao", "Shao & Lam", "Shao et al." */
	cite: string;
	/** Year with a/b suffix when the same author part and year repeat. */
	year: string;
	/** Reference-list author part: "Shao, Y., Jiang, Y., & Lam, M. S." */
	authors: string;
	title: string;
	/** Preprints and reports italicise the title; articles italicise the source instead. */
	titleItalic: boolean;
	/** Bracketed or parenthesised descriptor after the title, e.g. "(arXiv:2402.14207)". */
	descriptor?: string;
	source?: string;
	/** Text after the italic source: ", 12(3), 1–10" or " (pp. 1–10)". */
	sourceDetails?: string;
	publisher?: string;
	href?: string;
};

const ARXIV = /arxiv(?: preprint)?\s*(?:arxiv:)?\s*(\d{4}\.\d{4,5})/i;

function initials(given: string): string {
	return given
		.split(/\s+/)
		.filter(Boolean)
		.map((part) =>
			part
				.split('-')
				.map((piece) => (/^[A-Z]\.$/.test(piece) ? piece : `${piece[0]}.`))
				.join('-')
		)
		.join(' ');
}

function listName(person: BibPerson): string {
	return person.given ? `${person.family}, ${initials(person.given)}` : person.family;
}

function listAuthors(people: BibPerson[]): string {
	const names = people.map(listName);
	if (names.length === 1) return names[0];
	if (names.length <= 20) return `${names.slice(0, -1).join(', ')}, & ${names.at(-1)}`;
	return `${names.slice(0, 19).join(', ')}, . . . ${names.at(-1)}`;
}

function citeAuthors(people: BibPerson[]): string {
	if (people.length === 1) return people[0].family;
	if (people.length === 2) return `${people[0].family} & ${people[1].family}`;
	return `${people[0].family} et al.`;
}

/** APA sentence case: keeps the first word, the word after a colon, protected words and words with inner capitals. */
function sentenceCase(title: string, protectedWords: string[]): string {
	let capitalizeNext = true;
	return title.replace(/[^\s]+/g, (word) => {
		const first = capitalizeNext;
		capitalizeNext = /[:?!]$/.test(word);
		if (first || protectedWords.some((kept) => word.includes(kept)) || !/^[A-Z][a-z'’]*(?:-[A-Z]?[a-z'’]*)*[,.;:?!]?$/.test(word)) return word;
		return word.toLowerCase();
	});
}

function format(entry: BibEntry): Omit<Reference, 'cite' | 'year'> {
	const f = entry.fields;
	const doi = f.doi?.replace(/^https?:\/\/doi\.org\//, '');
	const href = doi ? `https://doi.org/${doi}` : f.url;
	const title = sentenceCase(entry.title, entry.protectedWords);
	const base = { key: entry.key, authors: listAuthors(entry.authors), title, href };
	const arxiv = (/arxiv/i.test(f.archiveprefix ?? '') && f.eprint) || ARXIV.exec(f.journal ?? f.note ?? '')?.[1];

	if (arxiv) return { ...base, titleItalic: true, descriptor: `(arXiv:${arxiv})`, publisher: 'arXiv' };
	if (entry.type === 'article') {
		const issue = f.number ? `(${f.number})` : '';
		const volume = f.volume ? `, ${f.volume}${issue}` : '';
		const pages = f.pages ? `, ${f.pages}` : '';
		return { ...base, titleItalic: false, source: f.journal, sourceDetails: `${volume}${pages}` || undefined };
	}
	if (entry.type === 'inproceedings' || entry.type === 'incollection') {
		return {
			...base,
			titleItalic: false,
			source: f.booktitle,
			sourceDetails: f.pages ? ` (pp. ${f.pages})` : undefined,
			publisher: f.publisher
		};
	}
	return { ...base, titleItalic: true, publisher: f.publisher ?? f.institution ?? f.howpublished };
}

/** Formats a whole bibliography so `2024a`/`2024b` suffixes are assigned consistently across the site. */
export function formatBibliography(entries: BibEntry[]): Map<string, Reference> {
	const groups = new Map<string, BibEntry[]>();
	for (const entry of entries) {
		const id = `${citeAuthors(entry.authors)}|${entry.year}`;
		groups.set(id, [...(groups.get(id) ?? []), entry]);
	}
	const references = new Map<string, Reference>();
	for (const group of groups.values()) {
		group.sort((a, b) => a.title.localeCompare(b.title));
		group.forEach((entry, index) => {
			const suffix = group.length > 1 ? String.fromCharCode(97 + index) : '';
			references.set(entry.key, {
				...format(entry),
				cite: citeAuthors(entry.authors),
				year: `${entry.year}${suffix}`
			});
		});
	}
	return references;
}

/** "(Jiang et al., 2024; Shao et al., 2024)" or, narrative, "Shao et al. (2024)". */
export function citeLabel(references: Reference[], narrative = false): string {
	if (narrative) return references.map((ref) => `${ref.cite.replace(' & ', ' and ')} (${ref.year})`).join('; ');
	return `(${sortReferences(references)
		.map((ref) => `${ref.cite}, ${ref.year}`)
		.join('; ')})`;
}

/** APA reference-list order: author list, then year. */
export function sortReferences(references: Reference[]): Reference[] {
	return [...references].sort((a, b) => a.authors.localeCompare(b.authors) || a.year.localeCompare(b.year));
}
