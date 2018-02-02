import { Way } from '../structures';
import { compareTags } from './compareTags';

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

  if (!compareTags(way.tags, compareWith.tags)) {
    return false;
  }
  if (!compareTags(way.attributes, compareWith.attributes)) {
    return false;
  }

  if (way.type !== compareWith.type) {
    return false;
  }

  return true;
}
