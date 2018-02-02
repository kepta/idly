import { Node } from '../structures';
import { compareTags } from './compareTags';

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

  if (!compareTags(node.tags, compareWith.tags)) {
    return false;
  }

  if (!compareTags(node.attributes, compareWith.attributes)) {
    return false;
  }

  if (node.type !== compareWith.type) {
    return false;
  }

  return true;
}
