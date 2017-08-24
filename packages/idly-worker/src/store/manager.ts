import { BBox } from '@turf/helpers';
import { parseXML } from '../parsing/parser';

import { EntityTable, entityTableGen, ParentWays } from 'idly-common/lib';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { Tile } from 'idly-common/lib/geo/tile';
import { IdlyOSM } from 'idly-osm/lib/index';

import { entityToGeoJSON } from '../geojson/entityToGeoJSON';
import { fetchTile } from '../parsing/fetch';
import { TilesCache } from '../store/tilesCache';

const idlyOSM = new IdlyOSM();

function computePropsTable(t: EntityTable, p: ParentWays) {
  const props = idlyOSM.onParseEntities(t, p);
  return props;
}

export class Manager {
  private tilesCache = new TilesCache();
  private parentWays: ParentWays = new Map();

  receive(bbox: BBox, zoom: number) {
    zoom = Math.floor(zoom);
    const xyzs = bboxToTiles(bbox, zoom);
    console.log(bbox, zoom, xyzs);
    return this.fetchAndParse(xyzs).then(() => this.toFeatures(bbox, zoom));
  }
  private fetchAndParse(xyzs: Tile[]) {
    // @TOFIX parseXML directly mutates parentWays not good
    return Promise.all(
      xyzs.filter(t => !this.tilesCache.has(t)).map(t => this.fetchProcess(t))
    );
  }
  private fetchProcess(t: Tile) {
    return fetchTile(t.x, t.y, t.z)
      .then(xml => parseXML(xml, this.parentWays))
      .then(e => {
        // even though parentWays is the same, because it
        // is a damn map, which is mutated directly is directly mutated.
        this.parentWays = e.parentWays;
        this.tilesCache.set(t, e.entities);
      });
  }
  private toFeatures(bbox: BBox, zoom: number) {
    const entities = this.tilesCache.search(bbox, zoom, 1);
    const entityTable: EntityTable = entityTableGen(new Map(), entities);
    const cmptProps = computePropsTable(entityTable, this.parentWays);
    const feats = entityToGeoJSON(entityTable, cmptProps);
    return feats;
  }
}
