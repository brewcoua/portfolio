import type { Relationship, RelationshipType } from '$lib/content/types';

type HasId = { id: string };
type HasRelationships = { id: string; relationships: Relationship[] };

export function getByType(
	relationships: Relationship[],
	type: RelationshipType
): Relationship[] {
	return relationships.filter((relationship) => relationship.type === type);
}

export function getRelated<T extends HasId>(
	relationships: Relationship[],
	entities: T[],
	type?: RelationshipType
): T[] {
	const allowed = type
		? relationships.filter((relationship) => relationship.type === type)
		: relationships;
	const ids = new Set(allowed.map((relationship) => relationship.targetId));
	return entities.filter((entity) => ids.has(entity.id));
}

export function getReverseRelations<T extends HasRelationships>(
	owners: T[],
	targetId: string,
	type?: RelationshipType
): T[] {
	return owners.filter((owner) =>
		owner.relationships.some(
			(relationship) =>
				relationship.targetId === targetId && (!type || relationship.type === type)
		)
	);
}
