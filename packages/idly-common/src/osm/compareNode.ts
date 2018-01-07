import { compareShallow } from './compareShallow';
import { Node, Way } from './structures';

export function compareNode(node: Node, compareWith: Node): boolean {
  if (node === compareWith) {
    return true;
  }

  if (node.id !== compareWith.id) {
    return false;
  }

  if (
    !Object.is(node.loc.lat, compareWith.loc.lat) ||
    !Object.is(node.loc.lon, compareWith.loc.lon)
  ) {
    return false;
  }

  if (!compareShallow(node.tags, compareWith.tags)) {
    return false;
  }

  if (!compareShallow(node.attributes, compareWith.attributes)) {
    return false;
  }

  if (node.type !== compareWith.type) {
    return false;
  }

  return true;
}
