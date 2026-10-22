<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		forceSimulation,
		forceManyBody,
		forceLink,
		forceCollide,
		forceX,
		forceY,
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
	type SimNode = GraphNode & { x: number; y: number; fx?: number | null; fy?: number | null };
	type SimLink = { source: SimNode; target: SimNode; kind: string };

	// Types read apart by glyph, size and stroke style; only the profile uses the accent.
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
	/** Node types whose labels are always visible (the "who / what" story). */
	const ALWAYS_LABEL = new Set<NodeKind>(['profile', 'project', 'publication', 'experience', 'education']);

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
	const glyphOf = (id: string): Glyph => glyphById.get(id) ?? { Comp: CpuIcon };

	const radiusOf = (n: GraphNode) => 6.5 * n.weight;

	// Cluster foci: same-type nodes are gently pulled toward a point on a ring.
	const CLUSTER_TYPES: NodeKind[] = ['project', 'publication', 'experience', 'education', 'role', 'skill', 'technology'];
	const foci = new Map<NodeKind, { x: number; y: number }>([['profile', CENTER]]);
	CLUSTER_TYPES.forEach((type, i) => {
		const angle = (i / CLUSTER_TYPES.length) * Math.PI * 2 - Math.PI / 2;
		const radius = type === 'technology' || type === 'skill' ? 235 : 165;
		foci.set(type, { x: CENTER.x + Math.cos(angle) * radius, y: CENTER.y + Math.sin(angle) * radius });
	});

	let container: HTMLDivElement;
	let gEl: SVGGElement;
	let simulation: Simulation<SimNode, SimLink>;
	// d3 mutates these in place; reactivity is driven by `tick`, not by these refs.
	// svelte-ignore non_reactive_update
	let simNodes: SimNode[] = [];
	let simLinks: SimLink[] = [];

	let tick = $state(0);
	let transform = $state('');
	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let ready = $state(false);
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
			nodes: simNodes.map((n) => ({
				id: n.id,
				type: n.type,
				label: n.label,
				url: n.url,
				x: n.x,
				y: n.y,
				r: radiusOf(n),
				fill: TYPE_META[n.type].fill,
				stroke: TYPE_META[n.type].stroke,
				dash: TYPE_META[n.type].dash,
				tint: n.type === 'technology' || n.type === 'skill' ? n.color : undefined,
				solid: n.type === 'profile'
			})),
			links: simLinks.map((l) => ({ x1: l.source.x, y1: l.source.y, x2: l.target.x, y2: l.target.y, source: l.source.id, target: l.target.id }))
		};
	});

	const isDim = (id: string) => activeSet !== null && !activeSet.has(id);
	const isLinkActive = (s: string, t: string) => activeSet !== null && activeSet.has(s) && activeSet.has(t);
	const showLabel = (id: string, type: NodeKind) =>
		compact ? type === 'profile' : ALWAYS_LABEL.has(type) || active === id || (activeSet?.has(id) ?? false);

	function nodeClick(node: { id: string; url?: string }) {
		if (node.url) {
			goto(node.url);
			return;
		}
		selected = selected === node.id ? null : node.id;
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
				if (node.type !== 'profile') {
					node.fx = null;
					node.fy = null;
				}
			});
		select(el).call(behavior);
		return {};
	}

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// svelte-ignore state_referenced_locally
		const graph = data;

		simNodes = graph.nodes.map((n) => {
			const focus = foci.get(n.type) ?? CENTER;
			return { ...n, x: focus.x + (Math.random() - 0.5) * 40, y: focus.y + (Math.random() - 0.5) * 40 };
		});
		const byId = new Map(simNodes.map((n) => [n.id, n]));
		const profile = byId.get('profile');
		if (profile) {
			profile.x = CENTER.x;
			profile.y = CENTER.y;
			profile.fx = CENTER.x;
			profile.fy = CENTER.y;
		}
		simLinks = graph.links
			.map((l) => ({ source: byId.get(l.source)!, target: byId.get(l.target)!, kind: l.kind }))
			.filter((l) => l.source && l.target);

		simulation = forceSimulation<SimNode, SimLink>(simNodes)
			.force('charge', forceManyBody().strength(-150))
			.force('link', forceLink<SimNode, SimLink>(simLinks).distance(58).strength(0.45))
			.force('collide', forceCollide<SimNode>().radius((n) => radiusOf(n) + 4))
			.force('x', forceX<SimNode>((n) => (foci.get(n.type) ?? CENTER).x).strength(0.08))
			.force('y', forceY<SimNode>((n) => (foci.get(n.type) ?? CENTER).y).strength(0.08));

		if (reduced || compact) {
			simulation.stop();
			for (let i = 0; i < 400; i++) simulation.tick();
			tick++;
		} else {
			simulation.on('tick', () => tick++);
		}
		ready = true;
		if (compact) {
			// Square box around the settled layout's bounding box.
			const xs = simNodes.map((n) => n.x);
			const ys = simNodes.map((n) => n.y);
			const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
			const half = Math.max(x1 - x0, y1 - y0) / 2 + 24;
			const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
			fitBox = `${cx - half} ${cy - half} ${half * 2} ${half * 2}`;
			return () => simulation.stop();
		}

		// Zoom / pan.
		const svg = select(container.querySelector('svg') as SVGSVGElement);
		const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.5, 3])
			.on('zoom', (event) => {
				transform = event.transform.toString();
			});
		svg.call(zoomBehavior).call(zoomBehavior.transform, zoomIdentity);

		return () => simulation?.stop();
	});
</script>

<div class="graph-hero" class:compact bind:this={container}>
	<svg
		viewBox={compact ? fitBox : `0 0 ${WIDTH} ${HEIGHT}`}
		class="graph-svg"
		role="img"
		aria-label="Graph of Brewen Couaran's projects, experience, skills and technologies"
		aria-hidden={compact}
		onpointerleave={() => (hovered = null)}
	>
		<g bind:this={gEl} transform={transform}>
			{#if ready}
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
						onclick={() => nodeClick(node)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								nodeClick(node);
							}
						}}
					>
						<circle
							r={node.r}
							fill={node.solid ? node.fill : node.fill}
							stroke={node.stroke}
							stroke-width={1.25}
							stroke-dasharray={node.dash ? '3 3' : undefined}
						/>
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
						{#if showLabel(node.id, node.type)}
							<text
								class="graph-label"
								class:is-primary={node.type === 'profile'}
								y={node.r + 12}
								text-anchor="middle">{node.label}</text
							>
						{/if}
					</g>
				{/each}
			{/if}
		</g>
	</svg>

	{#if !compact}
	<ul class="graph-legend" aria-hidden="true">
		{#each LEGEND as type}
			<li>
				<span
					class="swatch"
					class:dash={TYPE_META[type].dash}
					style={`background:${TYPE_META[type].fill};border-color:${TYPE_META[type].stroke}`}
				></span>
				{TYPE_META[type].label}
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
	.graph-link {
		stroke: var(--faint);
		stroke-width: 1;
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
	.graph-node:focus-visible circle {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
	.graph-node.is-active:not(.is-profile) circle {
		stroke: var(--accent);
	}
	.graph-node.is-active .glyph {
		color: var(--accent);
	}
	.graph-node.is-dim {
		opacity: 0.22;
	}
	.graph-node circle {
		transition: stroke-width 0.15s ease;
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
	.graph-legend li {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.graph-legend .swatch {
		width: 0.85rem;
		height: 0.85rem;
		border: 1.5px solid var(--border);
		border-radius: 2px;
	}
	.graph-legend .swatch.dash {
		border-style: dashed;
	}
</style>
