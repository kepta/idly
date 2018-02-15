import { NodeGeometry, OsmGeometry } from 'idly-common/lib/osm/structures';

export function getNodeGeometry(parentWay: Set<string>): NodeGeometry {
  if (parentWay.size === 0) {
    return OsmGeometry.POINT;
  }

  return OsmGeometry.VERTEX;
}
