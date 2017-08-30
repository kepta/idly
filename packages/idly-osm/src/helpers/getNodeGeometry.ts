import {
  EntityId,
  NodeGeometry,
  OsmGeometry,
  ParentWays
} from 'idly-common/lib/osm/structures';

export function getNodeGeometry(
  id: EntityId,
  parentWay: Set<string>
): NodeGeometry {
  if (parentWay.size === 0) return OsmGeometry.POINT;

  return parentWay.size === 1 ? OsmGeometry.VERTEX : OsmGeometry.VERTEX_SHARED;
}
