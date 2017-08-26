import { weakCache } from 'idly-common/lib/misc/weakCache';
import { Tags, Way, EntityType } from 'idly-common/lib/osm/structures';

import { findInAreaKeys } from '../helpers/findInAreaKeys';
import { areaKeys } from '../presets/presets';
import { isClosed } from '../helpers/isClosed';

export const isArea = weakCache((way: Way) => {
  if (way.tags.get('area') === 'yes') return true;
  if (!isClosed(way) || way.tags.get('area') === 'no') return false;
  return findInAreaKeys(way.tags);
});
