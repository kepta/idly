import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { Relation } from 'idly-common/lib/osm/structures';
import { HighlightColor } from 'idly-common/lib/styling/highlight';

import { Derived } from './types';

export function relationCombiner(
  relation: Relation,
  table: Map<string, Derived>,
  geometryTable: WeakMap<Derived, Feature<Point | Polygon | LineString>>
) {
  return turnRestriction(relation, table, geometryTable);
}

function turnRestriction(
  relation: Relation,
  table: Map<string, Derived>,
  geometryTable: WeakMap<Derived, Feature<Point | Polygon | LineString>>
) {
  if (!relation.tags.type || !relation.tags.type.startsWith('restriction')) {
    return;
  }

  const ROLE = ['from', 'via', 'to'];
  const result: Array<Feature<Point | Polygon | LineString>> = [];

  const restrictiveToValue = makeToHighlightColor(relation.tags);

  for (const role of ROLE) {
    const members = relation.members.filter(r => r.role === role).map(r => {
      const d = table.get(r.id);
      if (d) {
        return geometryTable.get(d);
      }
      return;
    });

    if (members.length === 0) {
      return;
    }

    for (const r of members) {
      if (!r) {
        return;
      }

      let highlightColor = HighlightColor.KIND_UNIMPORTANT;

      if (role === 'to' && restrictiveToValue === 'no') {
        highlightColor = HighlightColor.KIND_NEVER;
      }

      if (role === 'to' && restrictiveToValue === 'only') {
        highlightColor = HighlightColor.KIND_ONLY;
      }

      if (role === 'from') {
        highlightColor = HighlightColor.KIND_NORMAL;
      }

      result.push({
        ...r,
        properties: {
          '@idly-geometry': r.properties && r.properties['@idly-geometry'],
          '@idly-highlight': highlightColor,
          '@idly-member-id': r.properties && r.properties.id,
          '@idly-name': role,
          '@idly-turn-restriction': role,
          // tslint:disable-next-line:object-literal-key-quotes
          id: relation.id,
        },
      });
    }
  }

  return result;
}

function makeToHighlightColor(
  tags: Record<string, string>
): 'no' | 'only' | undefined {
  for (const key of Object.keys(tags)) {
    const value = tags[key];
    if (key.startsWith('restriction')) {
      if (value.startsWith('no_')) {
        return 'no';
      }
      if (value.startsWith('only_')) {
        return 'only';
      }
    }
  }
  return undefined;
}
