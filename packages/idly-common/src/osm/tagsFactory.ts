import { Tags } from '../osm/structures';

// @TOFIX make tags frozen objects.
// and also figure out how to make reserved keys work in object
// or use so other data structure.
export function tagsFactory(rawTags: Array<[string, string]>): Tags {
  return new Tags(rawTags);
}
