import { Tags, Way, weakCache } from 'idly-common/lib';

import { findInAreaKeys } from '../helpers/findInAreaKeys';
import { areaKeys } from '../presets/presets';
import { isClosed } from '../helpers/isClosed';

export const isArea = weakCache((way: Way) => {
  if (way.tags.get('area') === 'yes') return true;
  if (!isClosed(way) || way.tags.get('area') === 'no') return false;
  return findInAreaKeys(way.tags);
});
