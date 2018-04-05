import area from '@turf/area';
import bboxClip from '@turf/bbox-clip';
import bboxPolygon from '@turf/bbox-polygon';
import { FeatureCollection } from '@turf/helpers';
import { BBox, mercator, Tile } from 'idly-common/lib/geo';
import parser from 'idly-faster-osm-parser';
import {
  IDLY_NS,
  PlaceHolderLayer1,
  PlaceHolderLayer2,
  PlaceHolderLayer3,
} from '../constants';
import { Layer } from '../layers/types';

export function addSource(layer: any, source: string) {
  return {
    ...layer,
    source,
    id: getNameSpacedLayerId(layer.id, source),
  };
}

export function getNameSpacedLayerId(layerId: string, source: string) {
  return source + IDLY_NS + layerId;
}

export function reverseGetNameSpacedLayerId(id: string) {
  return id.split(IDLY_NS)[1];
}

export function tilesFilterSmall(
  tiles: Tile[],
  viewportBbox: BBox,
  minimumOverlap: number
): Tile[] {
  const final = tiles
    .map(tile => {
      const tilePolygon = bboxPolygon(mercator.bbox(tile.x, tile.y, tile.z));
      const tileInsideBbox = bboxClip(tilePolygon, viewportBbox);

      const fractionVisible =
        area(tileInsideBbox) / area(bboxPolygon(viewportBbox));

      return { fractionVisible, tile };
    })
    .sort((a, b) => b.fractionVisible - a.fractionVisible)
    .reduce(
      (prev, { fractionVisible, tile }) => {
        if (prev.sum >= minimumOverlap) {
          return prev;
        }
        prev.tiles.push(tile);
        prev.sum += fractionVisible;

        return prev;
      },
      { sum: 0, tiles: [] as Tile[] }
    );

  return final.tiles;
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
  return fetch(`https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`)
    .then(r => (r.ok ? r.text() : Promise.reject(r.statusText)))
    .then(text => parser(text))
    .then(entities => {
      cache.set(bboxStr, entities);
      return entities;
    });
}

export function bboxify(e: any, factor: number) {
  return [
    [e.point.x - factor, e.point.y - factor],
    [e.point.x + factor, e.point.y + factor],
  ];
}
export const hideVersion = (index?: string) =>
  index && modifiedIdParse(index)[0];

export const modifiedIdParse = (index: string) => index.split('#');

export const distance = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

export function tapLog<T>(fn: T) {
  if (typeof fn !== 'function') {
    console.log('Log-- expression', fn);
    return fn;
  }
  return (...args: any[]) => {
    console.log('Log-- input', ...args);
    const result = (fn as any).apply(null, args);
    console.log('Log-- output', result);
    return result;
  };
}

export function bindThis(_: any, key: any, { value: fn }: any) {
  return {
    configurable: true,
    get() {
      const value = fn.bind(this);
      Object.defineProperty(this, key, {
        value,
        configurable: true,
        writable: true,
      });
      return value;
    },
  };
}

export const findPlaceholderLayers = (layers: Layer[]) => {
  const ids = layers.map(l => l.layer.id);

  return {
    top: ids.find(id => id.includes(PlaceHolderLayer1)),
    middle: ids.find(id => id.includes(PlaceHolderLayer2)),
    last: ids.find(id => id.includes(PlaceHolderLayer3)),
  };
};
