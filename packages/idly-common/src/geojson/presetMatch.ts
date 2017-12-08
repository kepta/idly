import { presetIndex } from 'idly-data/lib/presets/presetIndex';

import { OsmGeometry, Tags } from '../osm/structures';

export const all = presetIndex().init();

export const presetMatch: (tags: Tags, geometry: OsmGeometry) => any =
  all.match;
