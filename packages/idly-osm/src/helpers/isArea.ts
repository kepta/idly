import { weakCache } from 'idly-common/lib/misc/weakCache';
import { Tags, Way, EntityType } from 'idly-common/lib/osm/structures';

import { findInAreaKeys } from '../helpers/findInAreaKeys';

import { isClosed } from '../helpers/isClosed';

export const isArea = weakCache((way: Way) => {
  if (way.tags['area'] === 'yes') return true;
  if (!isClosed(way) || way.tags['area'] === 'no') return false;
  return findInAreaKeys(way.tags);
});
