import { Set as ImSet } from 'immutable';

import { NodeGeometry, OsmGeometry } from '../osm/structures';

export function getNodeGeometry(parentWay: ImSet<string>): NodeGeometry {
  if (parentWay.size === 0) {
    return OsmGeometry.POINT;
  }

  return OsmGeometry.VERTEX;
}
