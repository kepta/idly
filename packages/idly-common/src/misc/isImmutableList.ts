import { List as ImList } from 'immutable';

export function isImmutableList<T>(item: any): item is ImList<T> {
  return ImList.isList(item);
}
