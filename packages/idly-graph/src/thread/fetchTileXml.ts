import { mercator } from 'idly-common/lib/geo/sphericalMercator';
import { DOMParser } from 'xmldom';
import { BBox } from '@turf/helpers';

export async function fetchTileXml(
  x: number,
  y: number,
  zoom: number,
): Promise<string> {
  const xyz = [x, y, zoom].join(',');
  const bboxStr = mercator.bbox(x, y, zoom).join(',');
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`,
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const text = await response.text();
  return text;
}
