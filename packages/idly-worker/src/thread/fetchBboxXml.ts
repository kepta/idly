import { BBox } from '@turf/helpers';

export async function fetchBboxXml(bbox: BBox): Promise<string> {
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/map?bbox=${bbox.join(',')}`,
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const text = await response.text();
  return text;
}
