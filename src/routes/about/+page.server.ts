import { loadContent } from '$lib/server/content';
import { getDateSortKey } from '$lib/content/format';
import type { Education, Experience, MentionSource, Project } from '$lib/content/types';

type MentionMap = Map<string, MentionSource[]>;

function addMention(map: MentionMap, id: string, source: MentionSource): void {
	if (!id) return;
	const mentions = map.get(id) ?? [];
	if (!mentions.some((entry) => entry.key === source.key)) {
		mentions.push(source);
	}
	map.set(id, mentions);
}

function mapMentions(
	map: MentionMap,
	labelsById: Map<string, string>
): Array<{ id: string; sources: MentionSource[] }> {
	return [...map.entries()]
		.sort((left, right) =>
			(labelsById.get(left[0]) ?? left[0]).localeCompare(labelsById.get(right[0]) ?? right[0])
		)
		.map(([id, sources]) => ({
			id,
			sources: [...sources].sort((left, right) => left.label.localeCompare(right.label))
		}));
}

function gatherProjectMentions(projects: Project[], skillMentions: MentionMap, technologyMentions: MentionMap): void {
	for (const project of projects) {
		const source = {
			key: `project:${project.id}`,
			kind: 'project',
			label: project.title,
			href: `/projects/${project.slug}`
		} as const;
		for (const skillId of project.skills) addMention(skillMentions, skillId, source);
		for (const technologyId of project.technologies) addMention(technologyMentions, technologyId, source);
		for (const relationship of project.relationships) {
			if (relationship.type === 'skill') addMention(skillMentions, relationship.targetId, source);
			if (relationship.type === 'technology') addMention(technologyMentions, relationship.targetId, source);
		}
	}
}

function gatherExperienceMentions(
	experience: Experience[],
	skillMentions: MentionMap,
	technologyMentions: MentionMap
): void {
	for (const item of experience) {
		const source = {
			key: `experience:${item.id}`,
			kind: 'experience',
			label: `${item.title} at ${item.organization}`,
			href: `/experience/${item.slug}`
		} as const;
		for (const technologyId of item.technologies) addMention(technologyMentions, technologyId, source);
		for (const relationship of item.relationships) {
			if (relationship.type === 'skill') addMention(skillMentions, relationship.targetId, source);
			if (relationship.type === 'technology') addMention(technologyMentions, relationship.targetId, source);
		}
	}
}

function gatherEducationMentions(
	education: Education[],
	skillMentions: MentionMap,
	technologyMentions: MentionMap,
	skillIds: Set<string>,
	technologyIds: Set<string>
): void {
	for (const item of education) {
		const source = {
			key: `education:${item.id}`,
			kind: 'education',
			label: `${item.degree} at ${item.institution}`,
			href: `/education/${item.slug}`
		} as const;
		for (const focusId of item.focus) {
			if (skillIds.has(focusId)) addMention(skillMentions, focusId, source);
			if (technologyIds.has(focusId)) addMention(technologyMentions, focusId, source);
		}
		for (const relationship of item.relationships) {
			if (relationship.type === 'skill') addMention(skillMentions, relationship.targetId, source);
			if (relationship.type === 'technology') addMention(technologyMentions, relationship.targetId, source);
		}
	}
}

export async function load() {
	const { profile, projects, experience, education, skills, technologies, site } = await loadContent();
	const skillIds = new Set(skills.map((item) => item.id));
	const technologyIds = new Set(technologies.map((item) => item.id));
	const skillLabelsById = new Map(skills.map((item) => [item.id, item.label] as const));
	const technologyLabelsById = new Map(technologies.map((item) => [item.id, item.label] as const));
	const skillMentions: MentionMap = new Map();
	const technologyMentions: MentionMap = new Map();

	gatherProjectMentions(projects, skillMentions, technologyMentions);
	gatherExperienceMentions(experience, skillMentions, technologyMentions);
	gatherEducationMentions(education, skillMentions, technologyMentions, skillIds, technologyIds);

	return {
		profile,
		cvUrl: site.cvUrl,
		skills,
		technologies,
		mentionedSkills: mapMentions(skillMentions, skillLabelsById),
		mentionedTechnologies: mapMentions(technologyMentions, technologyLabelsById),
		experience: [...experience].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a))),
		education: [...education].sort((a, b) => getDateSortKey(b).localeCompare(getDateSortKey(a)))
	};
}
