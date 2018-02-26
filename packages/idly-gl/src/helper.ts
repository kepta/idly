import area from '@turf/area';
import bboxClip from '@turf/bbox-clip';
import bboxPolygon from '@turf/bbox-polygon';
import { FeatureCollection } from '@turf/helpers';
import { BBox, mercator, Tile } from 'idly-common/lib/geo';
import parser from 'idly-faster-osm-parser';

export function addSource(layer: any, source: string) {
  return {
    ...layer,
    source,
    id: getNameSpacedLayerId(layer.id, source),
  };
}
export function getNameSpacedLayerId(layerId: string, source: string) {
  return source + '-' + layerId;
}

export function tilesFilterSmall(
  tiles: Tile[],
  viewportBbox: BBox,
  minimumOverlap: number
): Tile[] {
  const final = tiles.filter(tile => {
    const tilePolygon = bboxPolygon(mercator.bbox(tile.x, tile.y, tile.z));
    const tileInsideBbox = bboxClip(tilePolygon, viewportBbox);

    const fractionVisible = area(tileInsideBbox) / area(tilePolygon);

    return fractionVisible >= minimumOverlap;
  });

  // console.log('main');
  // console.log(
  //   JSON.stringify({
  //     type: 'FeatureCollection',
  //     features: [
  //       bboxPolygon(viewportBbox),
  //       ...final.map(tile =>
  //         bboxPolygon(mercator.bbox(tile.x, tile.y, tile.z))
  //       ),
  //     ],
  //   })
  // );
  // console.log('mainEnd');

  return final;
}

export function blankFC(): FeatureCollection<any, any> {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

const cache: any = new Map();

export async function fetchTileXml(
  x: number,
  y: number,
  zoom: number
): Promise<any> {
  const bboxStr = mercator.bbox(x, y, zoom).join(',');
  if (cache.has(bboxStr)) {
    return cache.get(bboxStr);
  }
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const entities = parser(await response.text());
  cache.set(bboxStr, entities);
  return entities;
}

export function bboxify(e: any, factor: number) {
  return [
    [e.point.x - factor, e.point.y - factor],
    [e.point.x + factor, e.point.y + factor],
  ];
}

export const hideVersion = (index: string) =>
  index && modifiedIdParse(index)[0];

const modifiedIdParse = (index: string) => index.split('#');
