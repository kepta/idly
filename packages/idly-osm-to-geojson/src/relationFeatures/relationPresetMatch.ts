import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { OsmGeometry, Relation } from 'idly-common/lib/osm/structures';
import { Derived } from '../types';

export function relationPresetMatch(derived: Derived<Relation>) {
  const relation = derived.entity;
  const geometry = isMultiPolygon(relation)
    ? OsmGeometry.AREA
    : OsmGeometry.RELATION;
  const match = presetMatch(relation.tags, geometry);

  return { match, geometry };
}

function isMultiPolygon(r: Relation) {
  return false;
}
