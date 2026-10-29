import { describe, expect, it } from 'vitest';
import { sortProjects } from './project-discovery';
import type { Project } from './types';

const project = (slug: string, date: string, complexity: number, value: number) =>
	({ slug, date, complexity, value }) as Project;

const projects = [project('a', '2024-01', 3, 3), project('b', '2025-06', 2, 4), project('c', '2023-02', 5, 1)];
const slugs = (sort: Parameters<typeof sortProjects>[1]) => sortProjects(projects, sort).map((p) => p.slug);

describe('sortProjects', () => {
	it('sorts by date', () => {
		expect(slugs('newest')).toEqual(['b', 'a', 'c']);
		expect(slugs('oldest')).toEqual(['c', 'a', 'b']);
	});

	it('sorts levels descending, newest first on ties', () => {
		expect(slugs('complexity')).toEqual(['c', 'a', 'b']);
		expect(slugs('value')).toEqual(['b', 'a', 'c']);
		expect(slugs('score')).toEqual(['b', 'a', 'c']);
	});
});
