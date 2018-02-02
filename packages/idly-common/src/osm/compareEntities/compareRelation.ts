import { Relation } from '../structures';
import { compareTags } from './compareTags';

export function compareRelation(
  relation: Relation,
  compareWith: Relation
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

  if (!compareTags(relation.tags, compareWith.tags)) {
    return false;
  }
  if (!compareTags(relation.attributes, compareWith.attributes)) {
    return false;
  }

  if (relation.type !== compareWith.type) {
    return false;
  }

  return true;
}
