import type { BibEntry, BibPerson } from '$lib/content/apa';

// Enough BibTeX for arXiv and Google Scholar exports: braced or quoted values, `and`-separated
// names, common LaTeX accents. No @string macros or crossref.

const ACCENTS: Record<string, string> = {
	"'": '́',
	'`': '̀',
	'^': '̂',
	'"': '̈',
	'~': '̃',
	'=': '̄',
	'.': '̇',
	u: '̆',
	v: '̌',
	H: '̋',
	r: '̊',
	c: '̧'
};

function delatex(value: string): string {
	return value
		.replace(/\\([`'^"~=.uvHrc])\s*\{?\\?([A-Za-z])\}?/g, (_m, accent: string, letter: string) =>
			`${letter}${ACCENTS[accent]}`.normalize('NFC')
		)
		.replace(/\\([&%$#_])/g, '$1')
		.replace(/--/g, '–')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Reads one `{…}` or `"…"` value starting at `start`; returns the raw inner text and the index after it. */
function readValue(source: string, start: number): [string, number] {
	if (source[start] === '"') {
		const end = source.indexOf('"', start + 1);
		return [source.slice(start + 1, end), end + 1];
	}
	if (source[start] !== '{') {
		const match = /^[^,}\s]+/.exec(source.slice(start));
		return [match?.[0] ?? '', start + (match?.[0].length ?? 0)];
	}
	let depth = 0;
	for (let i = start; i < source.length; i++) {
		if (source[i] === '\\') i++;
		else if (source[i] === '{') depth++;
		else if (source[i] === '}' && --depth === 0) return [source.slice(start + 1, i), i + 1];
	}
	throw new Error(`references.bib: unbalanced braces from offset ${start}`);
}

function person(raw: string): BibPerson {
	const name = delatex(raw.replace(/[{}]/g, ''));
	const comma = name.indexOf(',');
	if (comma !== -1) return { family: name.slice(0, comma).trim(), given: name.slice(comma + 1).trim() };
	const parts = name.split(' ');
	return { family: parts.pop() ?? name, given: parts.join(' ') };
}

export function parseBibtex(source: string): BibEntry[] {
	const entries: BibEntry[] = [];
	const head = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
	for (let match = head.exec(source); match; match = head.exec(source)) {
		const fields: Record<string, string> = {};
		let i = head.lastIndex;
		const field = /\s*([\w-]+)\s*=\s*/y;
		for (;;) {
			field.lastIndex = i;
			const name = field.exec(source);
			if (!name) break;
			const [value, next] = readValue(source, field.lastIndex);
			fields[name[1].toLowerCase()] = value;
			i = /^\s*,/.test(source.slice(next)) ? source.indexOf(',', next) + 1 : next;
		}
		head.lastIndex = i;

		const key = match[2];
		const rawTitle = fields.title ?? '';
		if (!rawTitle || !fields.author || !fields.year) {
			throw new Error(`references.bib: ${key} needs title, author and year`);
		}
		const protectedWords = [...rawTitle.matchAll(/\{([^{}]+)\}/g)].flatMap((m) => delatex(m[1]).split(' '));
		entries.push({
			key,
			type: match[1].toLowerCase(),
			authors: fields.author.split(/\s+and\s+/).map(person),
			title: delatex(rawTitle.replace(/[{}]/g, '')),
			protectedWords,
			year: fields.year,
			fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, delatex(v.replace(/[{}]/g, ''))]))
		});
	}
	return entries;
}
