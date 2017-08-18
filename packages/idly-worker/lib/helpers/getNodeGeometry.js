import { Geometry } from 'structs/geometry';
export function getNodeGeometry(id, parentWays) {
    if (parentWays.has(id))
        return parentWays.get(id).size > 1
            ? Geometry.VERTEX_SHARED
            : Geometry.VERTEX;
    return Geometry.POINT;
}
//# sourceMappingURL=getNodeGeometry.js.map