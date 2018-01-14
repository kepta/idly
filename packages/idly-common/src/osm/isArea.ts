import { weakCache } from '../misc/weakCache';

import { Way } from '../osm/structures';

import { findInAreaKeys } from './findInAreaKeys';
import { isClosed } from './isClosed';

export const isArea = weakCache((way: Way) => {
  if (way.tags.area === 'yes') { return true; }
  if (!isClosed(way) || way.tags.area === 'no') { return false; }
  return findInAreaKeys(way.tags);
});
