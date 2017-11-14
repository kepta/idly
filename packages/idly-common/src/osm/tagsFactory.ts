import { sortObjectKeys } from '../../lib/misc/sortObjectKeys';
import { Tags } from '../osm/structures';

// @TOFIX make tags frozen objects.
// and also figure out how to make reserved keys work in object
// or use so other data structure.
const emptyTag = {};
export function tagsFactory(
  rawTags: { [key: string]: string } = emptyTag,
): Tags {
  return sortObjectKeys(rawTags);
}
