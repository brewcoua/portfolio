import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { gfmFootnote } from 'micromark-extension-gfm-footnote';
import { gfmFootnoteFromMarkdown } from 'mdast-util-gfm-footnote';

export type MdastNode = {
	type: string;
	value?: string;
	url?: string;
	alt?: string;
	depth?: number;
	lang?: string;
	meta?: string;
	identifier?: string;
	ordered?: boolean;
	children?: MdastNode[];
};

/** Only GFM footnotes (rendered as sidenotes); full remark-gfm would also autolink and add tables everywhere. */
function remarkFootnotes(this: ReturnType<typeof unified>) {
	const data = this.data();
	(data.micromarkExtensions ??= []).push(gfmFootnote());
	(data.fromMarkdownExtensions ??= []).push(gfmFootnoteFromMarkdown());
}

export function parseMarkdown(source: string): MdastNode {
	return unified().use(remarkParse).use(remarkFootnotes).parse(source) as MdastNode;
}
