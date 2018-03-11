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

  for (let i = 0; i < relation.members.length; i++) {
    if (relation.members[i].id !== compareWith.members[i].id) {
      return false;
    }
    if (relation.members[i].role !== compareWith.members[i].role) {
      return false;
    }
    if (relation.members[i].ref !== compareWith.members[i].ref) {
      return false;
    }
    if (relation.members[i].type !== compareWith.members[i].type) {
      return false;
    }
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
