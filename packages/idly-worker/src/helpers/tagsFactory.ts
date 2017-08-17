import { Tags } from 'structs/tags';

export function tagsFactory(obj: { [key: string]: string }): Tags {
  const tags: Tags = new Map();
  Object.keys(obj).forEach(k => tags.set(k, obj[k]));
  return tags;
}
