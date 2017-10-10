import { fetchTile } from '../parsing/fetch';
import { parseXML } from '../parsing/parser';

export async function processTile(x: number, y: number, z: number) {
  try {
    const xml = await fetchTile(x, y, z);
    const data = parseXML(xml);
    return data;
  } catch (error) {
    return undefined;
  }
}
