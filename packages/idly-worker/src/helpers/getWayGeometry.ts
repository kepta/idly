import { isArea } from 'helpers/isArea';
import { Geometry } from 'structs/geometry';
import { Way } from 'structs/way';

export const getWayGeometry = (way: Way) =>
  isArea(way) ? Geometry.AREA : Geometry.LINE;
