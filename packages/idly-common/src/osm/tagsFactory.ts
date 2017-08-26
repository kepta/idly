import { Tags } from "../osm/structures";

// @TOFIX make tags frozen objects.
// and also figure out how to make reserved keys work in object
// or use so other data structure.
export function tagsFactory(obj: { [key: string]: string }): Tags {
  const tags: Tags = new Map();
  Object.keys(obj).forEach((k) => tags.set(k, obj[k]));
  return tags;
}
