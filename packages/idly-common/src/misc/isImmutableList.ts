import { Entity } from '../osm/structures';
import { ImList } from './immutable';

export function isImmutableList<T>(item: ImList<T> | T[]): item is ImList<T> {
  return ImList.isList(item);
}
