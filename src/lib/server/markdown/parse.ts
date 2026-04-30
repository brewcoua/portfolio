import { unified } from 'unified';
import remarkParse from 'remark-parse';

export type MdastNode = {
	type: string;
	value?: string;
	url?: string;
	depth?: number;
	lang?: string;
	ordered?: boolean;
	children?: MdastNode[];
};

export function parseMarkdown(source: string): MdastNode {
	return unified().use(remarkParse).parse(source) as MdastNode;
}
