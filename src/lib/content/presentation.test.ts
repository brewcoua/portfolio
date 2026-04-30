import { describe, expect, it } from 'vitest';
import {
	contrastRatio,
	getRoleChipStyle,
	parseHexColor,
	pickReadableForeground
} from '$lib/content/presentation';
import type { Role } from '$lib/content/types';

describe('presentation color helpers', () => {
	it('parses 3 and 6 digit hex colors', () => {
		expect(parseHexColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
		expect(parseHexColor('#1f2e3d')).toEqual({ r: 31, g: 46, b: 61 });
		expect(parseHexColor('nope')).toBeNull();
	});

	it('computes higher contrast for opposite luminance', () => {
		const black = { r: 0, g: 0, b: 0 };
		const white = { r: 255, g: 255, b: 255 };
		const gray = { r: 120, g: 120, b: 120 };

		expect(contrastRatio(black, white)).toBeGreaterThan(contrastRatio(gray, white));
	});

	it('picks readable candidate when available', () => {
		const background = { r: 246, g: 248, b: 252 };
		const hardToRead = { r: 220, g: 224, b: 233 };
		const readable = { r: 24, g: 29, b: 39 };

		expect(pickReadableForeground(background, [hardToRead, readable])).toEqual(readable);
	});

	it('falls back to best available when none pass threshold', () => {
		const background = { r: 110, g: 110, b: 110 };
		const candidateA = { r: 130, g: 130, b: 130 };
		const candidateB = { r: 70, g: 70, b: 70 };

		expect(pickReadableForeground(background, [candidateA, candidateB], 7)).toEqual(candidateB);
	});

	it('getRoleChipStyle emits contrast tokens when role has valid color', () => {
		const roles: Role[] = [
			{ id: 'role-x', slug: 'x', label: 'X', color: '#4f46e5', relationships: [] }
		];
		const style = getRoleChipStyle('role-x', roles);
		expect(style).toContain('--chip-bg-light');
		expect(style).toContain('light-dark');
	});
});
