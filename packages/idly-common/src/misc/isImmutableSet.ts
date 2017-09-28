import { ImSet } from './immutable';

export function isImmutableSet<T>(item: ImSet<T> | T[]): item is ImSet<T> {
  return ImSet.isSet(item);
}
