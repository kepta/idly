// import { BBox } from 'idly-common/lib/geo/bbox';
// import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
// import { Entity } from 'idly-common/lib/osm/structures';

// import { fetchTile } from '../parsing/fetch';
// import { parseXML } from '../parsing/parser';

// export async function receive(
//   bbox: BBox,
//   zoom: number,
//   cache: Map<string, Promise<Entity[]>>
// ) {
//   zoom = 18;
//   zoom = Math.floor(zoom);
//   const tiles = bboxToTiles(bbox, zoom);

//   const entities = await Promise.all(
//     tiles.map(({ x, y, z }) => {
//       const str = `${x}.${y}.${z}`;
//       if (cache.has(str)) return cache.get(str);
//       const data = processTile(x, y, z);
//     })
//   );
// }

// export async function processTile(x: number, y: number, z: number) {
//   try {
//     const xml = await fetchTile(x, y, z);
//     const data = parseXML(xml);
//     return data;
//   } catch (error) {
//     return undefined;
//   }
// }
