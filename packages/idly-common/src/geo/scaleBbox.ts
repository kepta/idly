import * as turfbbox from '@turf/bbox';
import * as bboxPolygon from '@turf/bbox-polygon';
import { BBox } from '@turf/helpers';
import * as transformScale from '@turf/transform-scale';

export function scaleBbox(bbox: BBox, scale: number) {
  return turfbbox(transformScale(bboxPolygon(bbox), scale));
}
