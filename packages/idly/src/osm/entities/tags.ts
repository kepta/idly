import { Map } from 'immutable';
export type ITags = Map<string, any>;

export function tagsFactory(obj?: object) {
  return Map(obj);
}
