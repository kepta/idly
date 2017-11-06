import { List as ImList } from 'immutable';
import { Entity } from '../osm/structures';

export function isImmutableList<T>(item: any): item is ImList<T> {
  return ImList.isList(item);
}
