import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { Node, OsmGeometry } from 'idly-common/lib/osm/structures';
import { Derived } from '../types';

export function nodePresetMatch(element: Derived<Node>) {
  const size = element.parentWays.size;
  const geometry = size === 0 ? OsmGeometry.POINT : OsmGeometry.VERTEX;
  const match = presetMatch(element.entity.tags, geometry);

  return { match, geometry };
}
