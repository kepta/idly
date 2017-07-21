import { Map } from 'immutable';
export type ITags = Map<string, any>;

export function tagsFactory(obj?: object): Map<string, any> {
  return Map(obj);
}
