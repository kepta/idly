import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { isArea } from 'idly-common/lib/osm/isArea';
import { OsmGeometry, Way } from 'idly-common/lib/osm/structures';
import { Derived } from '../types';

export function wayPresetMatch(derived: Derived<Way>) {
  const way = derived.entity;

  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;

  const match = presetMatch(way.tags, geometry);

  return { match, geometry };
}
