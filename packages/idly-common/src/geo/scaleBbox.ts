import * as turfbbox from "@turf/bbox";
import * as bboxPolygon from "@turf/bbox-polygon";
import * as transformScale from "@turf/transform-scale";

import { BBox } from "../geo/bbox";

export function scaleBbox(bbox: BBox, scale: number) {
  return turfbbox(transformScale(bboxPolygon(bbox), scale));
}
