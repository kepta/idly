import * as turfbbox from '@turf/bbox';
import * as bboxPolygon from '@turf/bbox-polygon';
// minX, minY, maxX, maxY
import { BBox } from '@turf/helpers';
import * as transformScale from '@turf/transform-scale';

import { Entity, Node, Relation, Way } from 'idly-common/lib';
import { Tile } from 'idly-common/lib/geo/tile';

import { RbushCache } from './rbush';

export class TilesCache {
  static stringify(tile: Tile) {
    return [tile.x, tile.y, tile.z].join(',');
  }
  static scaleBbox(bbox: BBox, scale: number) {
    return turfbbox(transformScale(bboxPolygon(bbox), scale));
  }
  private rbushCache = new RbushCache();
  private cache: Map<string, Entity[]> = new Map();

  has(tile: Tile) {
    const xyz = TilesCache.stringify(tile);
    return this.cache.has(xyz);
  }
  set(tile: Tile, entities: Entity[]) {
    const xyz = TilesCache.stringify(tile);
    this.rbushCache.insert(tile);
    this.cache.set(xyz, entities);
  }
  get(tile: Tile) {
    const xyz = TilesCache.stringify(tile);
    return this.cache.get(xyz);
  }
  search(bbox: BBox, zoom: number, scale: number) {
    const scaledBbox = scale === 1 ? bbox : TilesCache.scaleBbox(bbox, scale);
    const resultTiles = this.rbushCache.search(scaledBbox);
    const tiledEntities = resultTiles.filter(t => t.xyz.z === zoom).map(t => {
      const tile = t.xyz;
      return this.get(tile);
    });
    console.log(zoom, tiledEntities.length);
    return tiledEntities.reduce((prev, cur) => prev.concat(cur), []);
  }
}
