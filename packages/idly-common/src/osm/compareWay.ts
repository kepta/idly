import { compareShallow } from './compareShallow';
import { Way } from './structures';

// readonly id: EntityId;
// readonly type: EntityType.WAY;
// readonly tags: Tags;
// readonly attributes: Attributes;
// readonly nodes: ReadonlyArray<EntityId>;
export function compareWay(way: Way, compareWith: Way): boolean {
  if (way === compareWith) {
    return true;
  }

  if (way.id !== compareWith.id) {
    return false;
  }
  if (way.nodes.length !== compareWith.nodes.length) {
    return false;
  }

  for (let i = 0; i < way.nodes.length; ++i) {
    if (way.nodes[i] !== compareWith.nodes[i]) {
      return false;
    }
  }

  if (!compareShallow(way.tags, compareWith.tags)) {
    return false;
  }
  if (!compareShallow(way.attributes, compareWith.attributes)) {
    return false;
  }

  if (way.type !== compareWith.type) {
    return false;
  }

  return true;
}
