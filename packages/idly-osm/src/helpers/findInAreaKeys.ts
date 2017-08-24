import { Tags } from 'idly-common/lib';

import { areaKeys } from '../presets/presets';

export const findInAreaKeys = (tags: Tags) => {
  let found = false;
  tags.forEach((v, key) => {
    if (areaKeys.has(key) && !areaKeys.hasIn([key, v])) {
      found = true;
      return false;
    }
  });
  return found;
};
