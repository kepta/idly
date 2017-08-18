import { isArea } from 'helpers/isArea';
import { Geometry } from 'structs/geometry';
export const getWayGeometry = (way) => isArea(way) ? Geometry.AREA : Geometry.LINE;
//# sourceMappingURL=getWayGeometry.js.map