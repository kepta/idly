import {
  EntityId,
  NodeGeometry,
  OsmGeometry,
  ParentWays
} from 'idly-common/lib/osm/structures';

export function getNodeGeometry(
  id: EntityId,
  parentWays: ParentWays
): NodeGeometry {
  if (parentWays.has(id))
    return parentWays.get(id).size > 1
      ? OsmGeometry.VERTEX_SHARED
      : OsmGeometry.VERTEX;
  return OsmGeometry.POINT;
}
