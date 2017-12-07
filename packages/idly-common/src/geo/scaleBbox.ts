import turfbbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import transformScale from '@turf/transform-scale';

import { BBox } from '../geo/bbox';

export function scaleBbox(bbox: BBox, scale: number) {
  return turfbbox(transformScale(bboxPolygon(bbox), scale));
}
