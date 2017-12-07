import { getAreaKeys } from 'idly-data/lib/areaKeys/areaKeys';
import { Tags } from '../osm/structures';

// `highway` and `railway` are typically linear features, but there
// are a few exceptions that should be treated as areas, even in the
// absence of a proper `area=yes` or `areaKeys` tag.. see #4194
const lineKeys: any = {
  highway: {
    rest_area: true,
    services: true,
  },
  railway: {
    roundhouse: true,
    station: true,
    traverser: true,
    turntable: true,
    wash: true,
  },
};

getAreaKeys();

export function findInAreaKeys(tags: Tags) {
  const areaKeys = getAreaKeys();
  for (const key in tags) {
    if (key in areaKeys && !(tags[key] in areaKeys[key])) {
      return true;
    }
    if (key in lineKeys && tags[key] in lineKeys[key]) {
      return true;
    }
  }
  return false;
}
