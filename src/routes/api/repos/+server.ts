import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { repoStatuses } from '$lib/server/repo-status';

/** Live: commits since each project's description, refreshed one repo at a time. */
export const prerender = false;

export const GET: RequestHandler = () => json(repoStatuses());
