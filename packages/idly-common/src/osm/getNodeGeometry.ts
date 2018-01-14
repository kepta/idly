import { Set as ImSet } from 'immutable';

import {
  EntityId,
  NodeGeometry,
  OsmGeometry,
} from '../osm/structures';

export function getNodeGeometry(
  id: EntityId,
  parentWay: ImSet<string>,
): NodeGeometry {
  if (parentWay.size === 0) { return OsmGeometry.POINT; }

  return OsmGeometry.VERTEX;
}
