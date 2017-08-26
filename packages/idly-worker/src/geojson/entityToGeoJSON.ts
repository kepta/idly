import {
  EntityTable,
  EntityType,
  ParentWays
} from 'idly-common/lib/osm/structures';
import { nodeCombiner } from '../parsing/nodeToFeature';
import { wayCombiner } from '../parsing/wayToFeature';

export function entityToGeoJSON(t: EntityTable, computedProps) {
  const arr = [];
  for (const [x, entity] of t) {
    if (entity.type === EntityType.NODE) {
      arr.push(nodeCombiner(entity, computedProps.get(x)));
    } else if (entity.type === EntityType.WAY) {
      arr.push(wayCombiner(entity, t, computedProps.get(x)));
    } else if (entity.type === EntityType.RELATION) {
      // @TOFIX
    }
  }
  return arr;
}
