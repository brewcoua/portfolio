<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		forceSimulation,
		forceManyBody,
		forceLink,
		forceCollide,
		type Simulation
	} from 'd3-force';
	import { select } from 'd3-selection';
	import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
	import { drag } from 'd3-drag';
	import type { Component } from 'svelte';
	import UserIcon from '@lucide/svelte/icons/user';
	import FolderGitIcon from '@lucide/svelte/icons/folder-git-2';
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import CpuIcon from '@lucide/svelte/icons/cpu';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import { getBrandIcon } from '$lib/content/brand-icons';
	import { resolveContentIcon } from '$lib/content/content-icons';
	import type { GraphData, GraphNode, NodeType } from '$lib/content/types';

	// `compact`: static thumbnail (precomputed layout, no zoom/drag/legend, profile label only).
	let { data, compact = false }: { data: GraphData; compact?: boolean } = $props();

	const WIDTH = 960;
	const HEIGHT = 620;
	const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

	type NodeKind = NodeType | 'profile';
	type SimNode = GraphNode & {
		x: number;
		y: number;
		vx?: number;
		vy?: number;
		fx?: number | null;
		fy?: number | null;
		/** Pinned home (profile, entities): a drag snaps back here on drop. */
		anchor?: { x: number; y: number };
	};
	type SimLink = { source: SimNode; target: SimNode; kind: string };

	// Types read apart by shape, glyph and stroke style; only the profile uses the accent.
	const TYPE_META: Record<NodeKind, { label: string; fill: string; stroke: string; dash?: boolean }> = {
		profile: { label: 'Me', fill: 'var(--accent)', stroke: 'var(--accent)' },
		project: { label: 'Projects', fill: 'var(--bg)', stroke: 'var(--fg)' },
		publication: { label: 'Publications', fill: 'var(--bg)', stroke: 'var(--fg)', dash: true },
		experience: { label: 'Experience', fill: 'var(--surface)', stroke: 'var(--muted)' },
		education: { label: 'Education', fill: 'var(--surface)', stroke: 'var(--muted)', dash: true },
		skill: { label: 'Skills', fill: 'var(--bg)', stroke: 'var(--faint)' },
		technology: { label: 'Technologies', fill: 'var(--bg)', stroke: 'var(--faint)' },
		role: { label: 'Roles', fill: 'var(--bg)', stroke: 'var(--faint)', dash: true }
	};
	const LEGEND: NodeKind[] = ['profile', 'project', 'publication', 'experience', 'education', 'skill', 'technology', 'role'];
	const ENTITY = new Set<NodeKind>(['project', 'publication', 'experience', 'education']);
	/** Node types whose labels are always visible (the "who / what" story). */
	const ALWAYS_LABEL = new Set<NodeKind>(['profile', ...ENTITY]);

	/** Per-type glyph; technologies use a brand mark, roles their frontmatter icon. */
	const TYPE_ICON: Record<NodeKind, Component> = {
		profile: UserIcon,
		project: FolderGitIcon,
		experience: BriefcaseIcon,
		education: GraduationCapIcon,
		skill: SparklesIcon,
		role: UserIcon, // roles and skills use their frontmatter icon below
		technology: CpuIcon,
		publication: FileTextIcon
	};

	// Resolve each node's glyph once (brand path or a Lucide component) — brand
	// lookups are static, so keep them out of the per-tick reactive view.
	// technology -> brand mark; role -> its frontmatter icon; others -> type glyph.
	type Glyph = { brand?: string; Comp?: Component };
	const glyphById = new Map<string, Glyph>();
	const degree = new Map<string, number>();
	// svelte-ignore state_referenced_locally
	for (const node of data.nodes) {
		const brand = node.type === 'technology' ? getBrandIcon(node.id) : null;
		if (brand) {
			glyphById.set(node.id, { brand: brand.path });
		} else if (node.type === 'role' || node.type === 'skill') {
			glyphById.set(node.id, { Comp: resolveContentIcon(node.icon) });
		} else {
			glyphById.set(node.id, { Comp: TYPE_ICON[node.type] });
		}
	}
	// svelte-ignore state_referenced_locally
	for (const link of data.links) {
		degree.set(link.source, (degree.get(link.source) ?? 0) + 1);
		degree.set(link.target, (degree.get(link.target) ?? 0) + 1);
	}
	const glyphOf = (id: string): Glyph => glyphById.get(id) ?? { Comp: CpuIcon };

	/** Type sets the base size; link count scales it, narrowly for entities, widely for tags. */
	function radiusOf(n: GraphNode) {
		const base = 6.5 * n.weight;
		if (n.type === 'profile') return base;
		const [lo, hi] = ENTITY.has(n.type) ? [0.9, 1.25] : [0.7, 1.9];
		return base * Math.min(hi, Math.max(lo, 0.65 + 0.22 * Math.sqrt(degree.get(n.id) ?? 0)));
	}

	function polygon(sides: number, r: number, rotation: number) {
		const points = Array.from({ length: sides }, (_, i) => {
			const a = rotation + (i / sides) * Math.PI * 2;
			return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
		});
		return `M${points.join('L')}Z`;
	}

	/** Outline path per type; null draws a circle (profile, technologies). */
	function shapePath(type: NodeKind, r: number): string | null {
		const s = r * 0.9;
		switch (type) {
			case 'project': {
				const c = s * 0.35;
				return `M${-s + c},${-s}H${s - c}A${c},${c} 0 0 1 ${s},${-s + c}V${s - c}A${c},${c} 0 0 1 ${s - c},${s}H${-s + c}A${c},${c} 0 0 1 ${-s},${s - c}V${-s + c}A${c},${c} 0 0 1 ${-s + c},${-s}Z`;
			}
			case 'publication': {
				const f = s * 0.6;
				return `M${-s},${-s}H${s - f}L${s},${-s + f}V${s}H${-s}Z`;
			}
			case 'experience':
				return polygon(6, r * 1.05, 0);
			case 'education':
				return polygon(5, r * 1.1, -Math.PI / 2);
			case 'skill':
				return polygon(4, r * 1.2, -Math.PI / 2);
			case 'role':
				return polygon(3, r * 1.3, -Math.PI / 2);
			default:
				return null;
		}
	}

	// Work (projects, publications) on the outer ring; career (experience, education) on an inner one.
	const RING = 290;
	const INNER_RING = 110;
	/** Tags stay outside this radius, so they settle in the band between the two rings. */
	const INNER_CLEAR = INNER_RING + 40;
	const GROUP_GAP = (14 / 180) * Math.PI;
	type Kind = { type: NodeKind; members: SimNode[] };
	/** One kind's arc (if any) with its caption. */
	type Group = { type: NodeKind; label: string; d: string | null; x: number; y: number };
	type Guides = {
		circles: { cx: number; cy: number; r: number; track: boolean }[];
		lines: { x1: number; y1: number; x2: number; y2: number }[];
	};

	const polar = (cx: number, cy: number, r: number, a: number) => ({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
	function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
		const s = polar(cx, cy, r, a0);
		const e = polar(cx, cy, r, a1);
		return `M${s.x},${s.y}A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${e.x},${e.y}`;
	}

	/** Seeded PRNG (mulberry32) so the layout is the same on every visit. */
	function seeded(seed: number) {
		return () => {
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	let container: HTMLDivElement;
	let gEl: SVGGElement;
	let simulation: Simulation<SimNode, SimLink>;
	// d3 mutates these in place; reactivity is driven by `tick`, not by these refs.
	// svelte-ignore non_reactive_update
	let simNodes: SimNode[] = [];
	let simLinks: SimLink[] = [];

	let tick = $state(0);
	let transform = $state('');
	let scale = $state(1);
	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let hiddenTypes = $state(new Set<NodeKind>());
	let ready = $state(false);
	let groups = $state<Group[]>([]);
	let guides = $state<Guides>({ circles: [], lines: [] });
	let fitBox = $state(`${CENTER.x - 320} ${CENTER.y - 320} 640 640`);

	// Adjacency for neighbor highlighting.
	const neighbors = $derived.by(() => {
		const map = new Map<string, Set<string>>();
		for (const link of data.links) {
			if (!map.has(link.source)) map.set(link.source, new Set());
			if (!map.has(link.target)) map.set(link.target, new Set());
			map.get(link.source)!.add(link.target);
			map.get(link.target)!.add(link.source);
		}
		return map;
	});

	const active = $derived(hovered ?? selected);
	const activeSet = $derived.by(() => {
		if (!active) return null;
		const set = new Set<string>([active]);
		for (const id of neighbors.get(active) ?? []) set.add(id);
		return set;
	});

	// Reactive view of node/link positions (re-reads on every tick).
	const view = $derived.by(() => {
		void tick;
		return {
			nodes: simNodes
				.filter((n) => !hiddenTypes.has(n.type))
				// Profile drawn last so its name sits above any tag that drifts under it.
				.sort((a, b) => Number(a.type === 'profile') - Number(b.type === 'profile'))
				.map((n) => {
					const r = radiusOf(n);
					return {
						id: n.id,
						type: n.type,
						label: n.label,
						url: n.url,
						x: n.x,
						y: n.y,
						r,
						path: shapePath(n.type, r),
						fill: TYPE_META[n.type].fill,
						stroke: TYPE_META[n.type].stroke,
						dash: TYPE_META[n.type].dash,
						tint: n.type === 'technology' || n.type === 'skill' ? n.color : undefined,
						solid: n.type === 'profile'
					};
				}),
			links: simLinks
				.filter((l) => !hiddenTypes.has(l.source.type) && !hiddenTypes.has(l.target.type))
				.map((l) => ({
					x1: l.source.x,
					y1: l.source.y,
					x2: l.target.x,
					y2: l.target.y,
					source: l.source.id,
					target: l.target.id
				}))
		};
	});

	const isDim = (id: string) => activeSet !== null && !activeSet.has(id);
	const isLinkActive = (s: string, t: string) => activeSet !== null && activeSet.has(s) && activeSet.has(t);

	const MAX_LABEL = 22;
	const shortLabel = (label: string) => (label.length > MAX_LABEL ? `${label.slice(0, MAX_LABEL - 1)}…` : label);
	// Labels keep a constant on-screen size, so zooming in frees room for more of them.
	const labelScale = $derived(1 / scale);

	const SIDES = ['below', 'above', 'right', 'left'] as const;
	type LabelSide = (typeof SIDES)[number];
	/**
	 * Labels shown at rest and their side, placed greedily by priority without overlapping other
	 * labels or nodes. Entities always get one; tags need enough links, a bar that drops as you zoom in.
	 */
	const placedLabels = $derived.by(() => {
		const nodes = view.nodes;
		if (compact) return new Map(nodes.filter((n) => n.type === 'profile').map((n) => [n.id, 'below' as LabelSide]));
		type Box = { x0: number; x1: number; y0: number; y1: number };
		const hit = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
		const priority = (n: (typeof nodes)[number]) =>
			(n.type === 'profile' ? 0 : ALWAYS_LABEL.has(n.type) ? 1 : 2) - (degree.get(n.id) ?? 0) / 1000;
		const placed: Box[] = groups.map((g) => {
			const w = (g.label.length * 6.6 + 4) * labelScale;
			return { x0: g.x - w / 2, x1: g.x + w / 2, y0: g.y - 10 * labelScale, y1: g.y + 3 * labelScale };
		});
		const out = new Map<string, LabelSide>();
		for (const n of [...nodes].sort((a, b) => priority(a) - priority(b))) {
			if (!ALWAYS_LABEL.has(n.type) && ((degree.get(n.id) ?? 0) + 1) * scale < 6) continue;
			const w = (shortLabel(n.label).length * 6.6 + 4) * labelScale;
			const h = 13 * labelScale;
			const gap = 2 * labelScale;
			const boxAt = (side: LabelSide): Box => {
				if (side === 'below' || side === 'above') {
					const top = side === 'below' ? n.y + n.r + gap : n.y - n.r - gap - h;
					return { x0: n.x - w / 2, x1: n.x + w / 2, y0: top, y1: top + h };
				}
				const x0 = side === 'right' ? n.x + n.r + gap : n.x - n.r - gap - w;
				return { x0, x1: x0 + w, y0: n.y - h / 2, y1: n.y + h / 2 };
			};
			const free = (box: Box) =>
				!placed.some((b) => hit(b, box)) &&
				!nodes.some((o) => o.id !== n.id && hit({ x0: o.x - o.r, x1: o.x + o.r, y0: o.y - o.r, y1: o.y + o.r }, box));
			const side = SIDES.find((s) => free(boxAt(s)));
			if (!side && !ALWAYS_LABEL.has(n.type)) continue;
			placed.push(boxAt(side ?? 'below'));
			out.set(n.id, side ?? 'below');
		}
		return out;
	});
	function labelAttrs(id: string, r: number) {
		const k = labelScale;
		switch (placedLabels.get(id) ?? 'below') {
			case 'above':
				return { x: 0, y: -r - 5 * k, anchor: 'middle' };
			case 'right':
				return { x: r + 3 * k, y: 4 * k, anchor: 'start' };
			case 'left':
				return { x: -r - 3 * k, y: 4 * k, anchor: 'end' };
			default:
				return { x: 0, y: r + 11 * k, anchor: 'middle' };
		}
	}
	const showLabel = (id: string) =>
		placedLabels.has(id) || (!compact && (active === id || (activeSet?.has(id) ?? false)));

	function nodeClick(node: { id: string; url?: string }) {
		if (node.url) {
			goto(node.url);
			return;
		}
		selected = selected === node.id ? null : node.id;
	}

	function toggleType(type: NodeKind) {
		const next = new Set(hiddenTypes);
		if (!next.delete(type)) next.add(type);
		hiddenTypes = next;
	}

	function dragAction(el: SVGGElement, node: SimNode) {
		if (compact) return {};
		const behavior = drag<SVGGElement, unknown>()
			.container(() => gEl)
			.on('start', (event) => {
				if (!event.active) simulation.alphaTarget(0.2).restart();
				node.fx = node.x;
				node.fy = node.y;
			})
			.on('drag', (event) => {
				node.fx = event.x;
				node.fy = event.y;
			})
			.on('end', (event) => {
				if (!event.active) simulation.alphaTarget(0);
				if (node.anchor) {
					returnHome(node);
				} else {
					node.fx = null;
					node.fy = null;
				}
			});
		select(el).call(behavior);
		return {};
	}

	/** Jaccard overlap of two nodes' neighbourhoods (shared techs, skills, roles…). */
	function similarity(a: SimNode, b: SimNode) {
		const na = neighbors.get(a.id) ?? new Set<string>();
		const nb = neighbors.get(b.id) ?? new Set<string>();
		let shared = 0;
		for (const id of na) if (nb.has(id)) shared++;
		return shared / (na.size + nb.size - shared || 1);
	}

	/**
	 * Cyclic order that puts similar entities side by side: a greedy walk, then 2-opt reversals
	 * for as long as they raise the summed similarity of neighbours around the loop.
	 */
	function ringOrder(nodes: SimNode[]) {
		const order = nodes.slice(0, 1);
		const rest = nodes.slice(1);
		while (rest.length > 0) {
			const last = order[order.length - 1];
			let best = 0;
			rest.forEach((n, i) => {
				if (similarity(last, n) > similarity(last, rest[best])) best = i;
			});
			order.push(...rest.splice(best, 1));
		}
		const n = order.length;
		let improved = n > 3;
		while (improved) {
			improved = false;
			for (let i = 0; i < n - 2; i++) {
				for (let j = i + 2; j < n; j++) {
					const [a, b, c, d] = [order[i], order[i + 1], order[j], order[(j + 1) % n]];
					if (d === a) continue;
					if (similarity(a, c) + similarity(b, d) > similarity(a, b) + similarity(c, d) + 1e-9) {
						order.splice(i + 1, j - i, ...order.slice(i + 1, j + 1).reverse());
						improved = true;
					}
				}
			}
		}
		return order;
	}

	function pin(n: SimNode, p: { x: number; y: number }) {
		n.anchor = p;
		n.x = n.fx = p.x;
		n.y = n.fy = p.y;
	}

	/** Ease a dropped anchored node back home (instantly under reduced motion). */
	function returnHome(node: SimNode) {
		const home = node.anchor!;
		const [x0, y0] = [node.fx ?? node.x, node.fy ?? node.y];
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const start = performance.now();
		simulation.alphaTarget(0.1).restart();
		const step = (now: number) => {
			const t = reduce ? 1 : Math.min(1, (now - start) / 300);
			const e = 1 - (1 - t) ** 3;
			node.fx = x0 + (home.x - x0) * e;
			node.fy = y0 + (home.y - y0) * e;
			if (t < 1) requestAnimationFrame(step);
			else simulation.alphaTarget(0);
		};
		requestAnimationFrame(step);
	}

	/** Keeps free nodes outside radius `r` of the centre (hard edge: moved back onto it). */
	function forceKeepOut(r: number) {
		let nodes: SimNode[] = [];
		// d3 scales velocity by (1 - velocityDecay) = 0.6 before moving, so aim through that.
		const KEEP = 0.6;
		const force = () => {
			for (const n of nodes) {
				if (n.anchor) continue;
				const [dx, dy] = [n.x + (n.vx ?? 0) * KEEP - CENTER.x, n.y + (n.vy ?? 0) * KEEP - CENTER.y];
				const d = Math.hypot(dx, dy) || 1;
				if (d >= r) continue;
				n.vx = (CENTER.x + (dx / d) * r - n.x) / KEEP;
				n.vy = (CENTER.y + (dy / d) * r - n.y) / KEEP;
			}
		};
		force.initialize = (all: SimNode[]) => (nodes = all);
		return force;
	}

	/** Spread kinds around a ring ∝ their count with a gap between kinds; returns each kind's [start, end) angle. */
	function sectorsOf(kinds: Kind[], offset = -Math.PI / 2) {
		const total = kinds.reduce((sum, k) => sum + k.members.length, 0);
		const slot = (Math.PI * 2 - GROUP_GAP * kinds.length) / total;
		let a = offset + GROUP_GAP / 2;
		return kinds.map((k) => {
			const start = a;
			a += k.members.length * slot + GROUP_GAP;
			return { ...k, start, end: start + k.members.length * slot, slot };
		});
	}

	/** Anchored map: pin entities on their kind's arc of the outer or inner ring; returns what to draw. */
	function placeAnchors(entities: SimNode[]): { groups: Group[]; guides: Guides } {
		const kindsOf = (types: NodeKind[]): Kind[] =>
			types
				.map((type) => ({ type, members: ringOrder(entities.filter((n) => n.type === type)) }))
				.filter((k) => k.members.length > 0);
		const centred = (r: number, track = false) => ({ cx: CENTER.x, cy: CENTER.y, r, track });
		const spoke = (a: number, r0: number, r1: number) => {
			const [p, q] = [polar(CENTER.x, CENTER.y, r0, a), polar(CENTER.x, CENTER.y, r1, a)];
			return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
		};
		/** Pin kinds as arcs of one centred ring; returns each arc and the divider angle in the gap before it. */
		const ring = (kinds: Kind[], r: number, offset: number, captionR: number) =>
			sectorsOf(kinds, offset).map((k) => {
				k.members.forEach((n, i) => pin(n, polar(CENTER.x, CENTER.y, r, k.start + (i + 0.5) * k.slot)));
				const pad = k.slot * 0.35;
				// Caption between two members (not over one) when the kind has an odd count above one.
				const mid = (k.start + k.end) / 2 + (k.members.length % 2 && k.members.length > 1 ? k.slot / 2 : 0);
				const group: Group = {
					type: k.type,
					label: TYPE_META[k.type].label.toLowerCase(),
					d: arcPath(CENTER.x, CENTER.y, r, k.start + pad, k.end - pad),
					...polar(CENTER.x, CENTER.y, captionR, mid)
				};
				return { group, divider: k.start - GROUP_GAP / 2 };
			});

		const outer = ring(kindsOf(['project', 'publication']), RING, -Math.PI / 2, RING + 40);
		const work = entities.filter((n) => n.type === 'project' || n.type === 'publication');
		const innerKinds = kindsOf(['experience', 'education']);
		// Turn the inner ring so each career entry faces the work it shares the most with.
		let best = 0;
		let bestCost = Infinity;
		for (let step = 0; step < 72; step++) {
			const offset = (step / 72) * Math.PI * 2;
			let cost = 0;
			for (const k of sectorsOf(innerKinds, offset)) {
				k.members.forEach((c, i) => {
					const a = k.start + (i + 0.5) * k.slot;
					for (const p of work) {
						const diff = Math.abs(a - Math.atan2(p.y - CENTER.y, p.x - CENTER.x)) % (Math.PI * 2);
						cost += similarity(c, p) * Math.min(diff, Math.PI * 2 - diff);
					}
				});
			}
			if (cost < bestCost) [best, bestCost] = [offset, cost];
		}
		const inner = ring(innerKinds, INNER_RING, best, INNER_RING - 28);
		return {
			groups: [...outer, ...inner].map((a) => a.group),
			guides: {
				circles: [centred(INNER_RING, true), centred((INNER_CLEAR + RING) / 2), centred(RING, true)],
				lines: [
					...outer.map((a) => spoke(a.divider, INNER_RING, RING + 24)),
					...inner.map((a) => spoke(a.divider, 44, INNER_RING))
				]
			}
		};
	}

	onMount(() => {
		const random = seeded(42);
		// svelte-ignore state_referenced_locally
		const graph = data;

		simNodes = graph.nodes.map((n) => ({
			...n,
			x: CENTER.x + (random() - 0.5) * 40,
			y: CENTER.y + (random() - 0.5) * 40
		}));
		const byId = new Map(simNodes.map((n) => [n.id, n]));
		const profile = byId.get('profile');
		if (profile) pin(profile, CENTER);
		// Anchored map: entities pinned in groups, tags settle between the entities they link.
		const placement = placeAnchors(simNodes.filter((n) => ENTITY.has(n.type)));
		if (!compact) [groups, guides] = [placement.groups, placement.guides];
		simLinks = graph.links
			.map((l) => ({ source: byId.get(l.source)!, target: byId.get(l.target)!, kind: l.kind }))
			.filter((l) => l.source && l.target);

		simulation = forceSimulation<SimNode, SimLink>(simNodes)
			.randomSource(random)
			.force('charge', forceManyBody().strength(-90))
			.force('link', forceLink<SimNode, SimLink>(simLinks).distance(58).strength(0.45))
			// The profile's collide radius covers its name, so tags settle clear of it.
			.force('collide', forceCollide<SimNode>().radius((n) => radiusOf(n) + (n.type === 'profile' ? 24 : 7)))
			.force('keepOut', forceKeepOut(INNER_CLEAR));

		// Settle up front so the view opens on a finished, fitted layout; ticks after that only follow drags.
		simulation.stop();
		for (let i = 0; i < 400; i++) simulation.tick();
		tick++;
		ready = true;

		const xs = [...simNodes.map((n) => n.x), ...groups.map((g) => g.x)];
		const ys = [...simNodes.map((n) => n.y), ...groups.map((g) => g.y)];
		const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
		if (compact) {
			// Square box around the settled layout's bounding box.
			const half = Math.max(x1 - x0, y1 - y0) / 2 + 24;
			const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
			fitBox = `${cx - half} ${cy - half} ${half * 2} ${half * 2}`;
			return;
		}
		// Wide side padding: ring labels hang past their node, which clips first on narrow screens.
		fitBox = `${x0 - 110} ${y0 - 40} ${x1 - x0 + 220} ${y1 - y0 + 80}`;
		simulation.on('tick', () => tick++);

		// Zoom / pan.
		const svg = select(container.querySelector('svg') as SVGSVGElement);
		const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.5, 4])
			.on('zoom', (event) => {
				transform = event.transform.toString();
				scale = event.transform.k;
			});
		svg.call(zoomBehavior).call(zoomBehavior.transform, zoomIdentity);

		return () => simulation?.stop();
	});
</script>

<div class="graph-hero" class:compact bind:this={container}>
	<svg
		viewBox={fitBox}
		class="graph-svg"
		role="img"
		aria-label="Graph of Brewen Couaran's projects, experience, skills and technologies"
		aria-hidden={compact}
		onpointerleave={() => (hovered = null)}
		onclick={(e) => {
			if (!(e.target as Element).closest('.graph-node')) selected = null;
		}}
	>
		<g bind:this={gEl} transform={transform}>
			{#if ready && !compact}
				<g class="graph-guides" aria-hidden="true">
					{#each guides.circles as c}
						<circle class:track={c.track} cx={c.cx} cy={c.cy} r={c.r} />
					{/each}
					{#each guides.lines as l}
						<line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
					{/each}
				</g>
			{/if}
			{#if ready}
				{#each groups.filter((g) => !hiddenTypes.has(g.type)) as group (group.type)}
					{#if group.d}<path class="graph-group" d={group.d} />{/if}
					<text
						class="graph-label graph-group-label"
						x={group.x}
						y={group.y}
						text-anchor="middle"
						style={`font-size: ${10 * labelScale}px; stroke-width: ${3 * labelScale}px`}>{group.label}</text
					>
				{/each}
				{#each view.links as link (link.source + '->' + link.target)}
					<line
						x1={link.x1}
						y1={link.y1}
						x2={link.x2}
						y2={link.y2}
						class="graph-link"
						class:is-active={isLinkActive(link.source, link.target)}
						class:is-dim={activeSet !== null && !isLinkActive(link.source, link.target)}
					/>
				{/each}
				{#each view.nodes as node (node.id)}
					{@const glyph = glyphOf(node.id)}
					{@const gs = node.r * 1.3}
					<g
						class="graph-node"
						class:is-dim={isDim(node.id)}
						class:is-profile={node.type === 'profile'}
						class:is-active={active === node.id}
						transform={`translate(${node.x},${node.y})`}
						use:dragAction={simNodes.find((n) => n.id === node.id)!}
						role="button"
						tabindex={compact ? -1 : 0}
						aria-label={`${TYPE_META[node.type].label}: ${node.label}`}
						onpointerenter={() => (hovered = node.id)}
						onpointerleave={() => (hovered = null)}
						onclick={() => nodeClick(node)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								nodeClick(node);
							}
						}}
					>
						{#if node.path}
							<path
								class="shape"
								d={node.path}
								fill={node.fill}
								style={`stroke: ${node.stroke}`}
								stroke-width={1.25}
								stroke-linejoin="round"
								stroke-dasharray={node.dash ? '3 3' : undefined}
							/>
						{:else}
							<circle
								class="shape"
								r={node.r}
								fill={node.fill}
								style={`stroke: ${node.stroke}`}
								stroke-width={1.25}
								stroke-dasharray={node.dash ? '3 3' : undefined}
							/>
						{/if}
						<g
							class={['glyph', node.tint && 'tint']}
							style={node.tint ? `--c: ${node.tint}` : undefined}
							transform={`translate(${-gs / 2},${-gs / 2})`}
						>
							{#if glyph.brand}
								<g transform={`scale(${gs / 24})`}>
									<path d={glyph.brand} fill="currentColor" />
								</g>
							{:else if glyph.Comp}
								{@const Glyph = glyph.Comp}
								<Glyph size={gs} aria-hidden="true" />
							{/if}
						</g>
						{#if showLabel(node.id)}
							{@const at = labelAttrs(node.id, node.r)}
							<text
								class="graph-label"
								class:is-primary={node.type === 'profile'}
								x={at.x}
								y={at.y}
								style={compact ? undefined : `font-size: ${(node.type === 'profile' ? 13 : 11) * labelScale}px; stroke-width: ${3 * labelScale}px`}
								text-anchor={at.anchor}>{active === node.id ? node.label : shortLabel(node.label)}</text
							>
						{/if}
					</g>
				{/each}
			{/if}
		</g>
	</svg>

	{#if !compact}
	<ul class="graph-legend">
		{#each LEGEND as type}
			{@const path = shapePath(type, 5.5)}
			<li>
				<button
					type="button"
					class:off={hiddenTypes.has(type)}
					aria-pressed={!hiddenTypes.has(type)}
					onclick={() => toggleType(type)}
				>
					<svg class="swatch" viewBox="-8 -8 16 16" aria-hidden="true">
						{#if path}
							<path
								d={path}
								fill={TYPE_META[type].fill}
								stroke={TYPE_META[type].stroke}
								stroke-width="1.25"
								stroke-dasharray={TYPE_META[type].dash ? '2 2' : undefined}
							/>
						{:else}
							<circle
								r="5.5"
								fill={TYPE_META[type].fill}
								stroke={TYPE_META[type].stroke}
								stroke-width="1.25"
								stroke-dasharray={TYPE_META[type].dash ? '2 2' : undefined}
							/>
						{/if}
					</svg>
					{TYPE_META[type].label}
				</button>
			</li>
		{/each}
	</ul>

	{/if}

	<!-- Non-visual fallback / navigation -->
	{#if !compact}
	<ul class="sr-only">
		{#each data.nodes as node}
			<li>
				{#if node.url}<a href={node.url}>{node.label} ({node.type})</a>{:else}{node.label} ({node.type}){/if}
			</li>
		{/each}
	</ul>
	{/if}
</div>

<style>
	.graph-hero {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.graph-svg {
		display: block;
		width: 100%;
		flex: 1;
		min-height: 0;
		touch-action: none;
		cursor: grab;
	}
	.compact .graph-svg {
		aspect-ratio: 1;
		pointer-events: none;
	}
	.compact .graph-node,
	.compact .graph-link {
		transition: none;
	}
	.graph-svg:active {
		cursor: grabbing;
	}
	.graph-guides {
		fill: none;
		stroke: var(--faint);
		stroke-width: 1;
		stroke-dasharray: 2 5;
		pointer-events: none;
	}
	.graph-guides * {
		vector-effect: non-scaling-stroke;
	}
	.graph-guides line {
		stroke: var(--muted);
		stroke-dasharray: 4 4;
		opacity: 0.6;
	}
	.graph-guides .track {
		stroke: var(--faint);
		stroke-dasharray: none;
	}
	.graph-group {
		fill: none;
		stroke: var(--faint);
		stroke-width: 6;
		stroke-linecap: round;
		opacity: 0.5;
		vector-effect: non-scaling-stroke;
	}
	.graph-group-label {
		fill: var(--muted);
		letter-spacing: 0.08em;
	}
	.graph-link {
		stroke: var(--faint);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
		transition: opacity 0.15s ease;
	}
	.graph-link.is-active {
		stroke: var(--accent);
		stroke-width: 1.5;
	}
	.graph-link.is-dim {
		opacity: 0.12;
	}
	.graph-node {
		cursor: pointer;
		transition: opacity 0.15s ease;
	}
	.graph-node:focus {
		outline: none;
	}
	.graph-node:focus-visible .shape {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
	.graph-node.is-active:not(.is-profile) .shape {
		stroke: var(--accent) !important;
	}
	.graph-node.is-active .glyph {
		color: var(--accent);
	}
	.graph-node.is-dim {
		opacity: 0.22;
	}
	.graph-node .shape {
		transition: stroke-width 0.15s ease;
		vector-effect: non-scaling-stroke;
	}
	.graph-node .glyph {
		pointer-events: none;
		color: var(--muted);
	}
	.graph-node .glyph.tint {
		color: oklch(from var(--c) var(--tint-l) min(c, var(--tint-c)) h);
	}
	.graph-node.is-profile .glyph {
		color: var(--accent-fg);
	}
	.graph-label {
		fill: var(--muted-foreground);
		font-size: 11px;
		font-weight: 500;
		pointer-events: none;
		paint-order: stroke;
		stroke: var(--bg);
		stroke-width: 3px;
	}
	.graph-label.is-primary {
		fill: var(--foreground);
		font-size: 13px;
		font-weight: 700;
	}
	.compact .graph-label.is-primary {
		font-size: 22px;
	}
	.graph-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.9rem;
		padding: 0.65rem 0.9rem;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
		color: var(--muted-foreground);
	}
	.graph-legend button {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
	}
	.graph-legend button:hover {
		color: var(--foreground);
	}
	.graph-legend button.off {
		opacity: 0.4;
		text-decoration: line-through;
	}
	.graph-legend .swatch {
		width: 1rem;
		height: 1rem;
		overflow: visible;
	}
</style>
