import { presetIndex } from 'idly-data/lib/presets/presetIndex';

import { OsmGeometry, Tags } from '../osm/structures';

export const all = (presetIndex() as any).init(); // @TOFIX better type for presetIndex

export const presetMatch: (tags: Tags, geometry: OsmGeometry) => any =
  all.match;
