import {
  EntityId,
  NodeGeometry,
  OsmGeometry,
  ParentWays
} from 'idly-common/lib/osm/structures';
import { ImSet } from 'idly-common/lib/misc/immutable';

export function getNodeGeometry(
  id: EntityId,
  parentWay: ImSet<string>
): NodeGeometry {
  if (parentWay.size === 0) return OsmGeometry.POINT;

  return OsmGeometry.VERTEX;
}
