import { OsmGeometry, Tags } from 'idly-common/lib/osm/structures';
import { presetIndex } from 'idly-data/lib/presets/presetIndex';

export const all = presetIndex().init();

export const presetMatch: (tags: Tags, geometry: OsmGeometry) => any =
  all.match;
