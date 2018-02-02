import { mercator } from 'idly-common/lib/geo';

export async function fetchTileXml(
  x: number,
  y: number,
  zoom: number
): Promise<string> {
  const bboxStr = mercator.bbox(x, y, zoom).join(',');
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const text = await response.text();
  return text;
}
