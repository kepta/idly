import { ParentWays } from 'parsing/parser';
import { Geometry } from 'structs/geometry';

export function getNodeGeometry(id, parentWays: ParentWays) {
  if (parentWays.has(id))
    return parentWays.get(id).size > 1
      ? Geometry.VERTEX_SHARED
      : Geometry.VERTEX;
  return Geometry.POINT;
}
