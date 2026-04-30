import type { Component } from 'svelte';

import AppWindowIcon from '@lucide/svelte/icons/app-window';
import AtomIcon from '@lucide/svelte/icons/atom';
import BrainCircuitIcon from '@lucide/svelte/icons/brain-circuit';
import BrainIcon from '@lucide/svelte/icons/brain';
import ChartNoAxesColumnIcon from '@lucide/svelte/icons/chart-no-axes-column';
import CloudIcon from '@lucide/svelte/icons/cloud';
import CodeIcon from '@lucide/svelte/icons/code';
import CoffeeIcon from '@lucide/svelte/icons/coffee';
import CogIcon from '@lucide/svelte/icons/cog';
import ComponentIcon from '@lucide/svelte/icons/component';
import ContainerIcon from '@lucide/svelte/icons/container';
import CpuIcon from '@lucide/svelte/icons/cpu';
import DatabaseIcon from '@lucide/svelte/icons/database';
import FileBracesIcon from '@lucide/svelte/icons/file-braces';
import FileCodeIcon from '@lucide/svelte/icons/file-code';
import LayersIcon from '@lucide/svelte/icons/layers';
import NetworkIcon from '@lucide/svelte/icons/network';
import PanelTopIcon from '@lucide/svelte/icons/panel-top';
import ServerIcon from '@lucide/svelte/icons/server';
import SparklesIcon from '@lucide/svelte/icons/sparkles';
import TagIcon from '@lucide/svelte/icons/tag';
import TerminalIcon from '@lucide/svelte/icons/terminal';
import UserIcon from '@lucide/svelte/icons/user';

/** Kebab-case names from YAML `icon`; values are Lucide Svelte components. */
export const CONTENT_ICON_MAP: Record<string, Component> = {
	'app-window': AppWindowIcon,
	atom: AtomIcon,
	brain: BrainIcon,
	'brain-circuit': BrainCircuitIcon,
	'chart-no-axes-column': ChartNoAxesColumnIcon,
	cloud: CloudIcon,
	code: CodeIcon,
	coffee: CoffeeIcon,
	cog: CogIcon,
	component: ComponentIcon,
	container: ContainerIcon,
	cpu: CpuIcon,
	database: DatabaseIcon,
	network: NetworkIcon,
	'panel-top': PanelTopIcon,
	server: ServerIcon,
	sparkles: SparklesIcon,
	terminal: TerminalIcon,
	user: UserIcon,
	layers: LayersIcon,
	'file-braces': FileBracesIcon,
	'file-code': FileCodeIcon
};

const FALLBACK_ICON = TagIcon;

export function resolveContentIcon(name: string | undefined): Component {
	if (!name?.trim()) return FALLBACK_ICON;
	return CONTENT_ICON_MAP[name] ?? FALLBACK_ICON;
}
