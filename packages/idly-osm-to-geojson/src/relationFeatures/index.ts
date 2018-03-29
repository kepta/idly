import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { OsmGeometry, Relation } from 'idly-common/lib/osm/structures';
import { Derived, RelevantGeometry } from '../types';
import { ensureMembers } from './helpers';
import { turnRestriction } from './turnRestriction';

export function relationFeatures(
  relation: Relation,
  table: Map<string, Derived>,
  geometryTable: WeakMap<Derived, RelevantGeometry>
): RelevantGeometry[] | undefined {
  const ensured = ensureMembers(relation.members, table, geometryTable);
  if (!ensured) {
    return;
  }

  const match = presetMatch(
    relation.tags,
    isMultiPolygon(relation) ? OsmGeometry.AREA : OsmGeometry.RELATION
  );

  return turnRestriction(relation, ensured, match.name({}));
}

function isMultiPolygon(r: Relation) {
  return false;
}
