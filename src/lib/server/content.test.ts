import { describe, expect, it } from 'vitest';
import { readMinutes } from './content';

describe('readMinutes', () => {
	it('reads 265 words a minute, at least one minute', () => {
		expect(readMinutes('word '.repeat(530))).toBe(2);
		expect(readMinutes('hi')).toBe(1);
	});

	it('adds 12s for the first image, one less per next, floored at 3s', () => {
		// 10 images: 12+11+…+3 = 75s, plus 1325 words (300s) = 375s ≈ 6 min
		expect(readMinutes('word '.repeat(1325) + '![a](x.svg)\n'.repeat(10))).toBe(6);
	});
});
