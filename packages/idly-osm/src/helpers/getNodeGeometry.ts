import {
  EntityId,
  NodeGeometry,
  OsmGeometry,
  ParentWays
} from 'idly-common/lib/osm/structures';
import { Set as ImSet } from 'immutable';

export function getNodeGeometry(
  id: EntityId,
  parentWay: ImSet<string>
): NodeGeometry {
  if (parentWay.size === 0) return OsmGeometry.POINT;

  return OsmGeometry.VERTEX;
}
