import { compareShallow } from './compareShallow';
import { Relation } from './structures';

// readonly id: EntityId;
// readonly type: EntityType.RELATION;
// readonly tags: Tags;
// readonly members: ReadonlyArray<RelationMember>;
// readonly attributes: Attributes;
export function compareRelation(
  relation: Relation,
  compareWith: Relation,
): boolean {
  if (relation === compareWith) {
    return true;
  }

  if (relation.id !== compareWith.id) {
    return false;
  }

  if (
    JSON.stringify(relation.members) !== JSON.stringify(compareWith.members)
  ) {
    return false;
  }

  if (!compareShallow(relation.tags, compareWith.tags)) {
    return false;
  }
  if (!compareShallow(relation.attributes, compareWith.attributes)) {
    return false;
  }

  if (relation.type !== compareWith.type) {
    return false;
  }

  return true;
}
