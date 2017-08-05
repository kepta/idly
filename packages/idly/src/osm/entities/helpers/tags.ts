import { Map } from 'immutable';
export type Tags = Map<string, string>;

export function tagsFactory(obj?: object): Tags {
  return Map(obj);
}
