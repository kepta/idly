import { BBox } from '@turf/helpers';
import { parseXML } from '../parsing/parser';

import {
  Entities,
  Entity,
  EntityId,
  EntityTable,
  entityTableGen,
  EntityType,
  Node,
  ParentWays,
  Relation,
  Way
} from 'idly-common/lib';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { Tile } from 'idly-common/lib/geo/tile';
import { onParseEntities } from 'idly-osm/lib/worker';

import { entityToGeoJSON } from '../geojson/entityToGeoJSON';
import { fetchTile } from '../parsing/fetch';
import { TilesCache } from '../store/tilesCache';
import { recursiveLookup } from '../util/recursiveLookup';

function computePropsTable(t: EntityTable, p: ParentWays) {
  const props = onParseEntities(t, p);
  return props;
}

export class Manager {
  private tilesCache = new TilesCache();
  private parentWays: ParentWays = new Map();
  private masterTable: EntityTable = new Map();
  receive(bbox: BBox, zoom: number) {
    zoom = Math.floor(zoom);
    const xyzs = bboxToTiles(bbox, zoom);
    console.log(bbox, zoom, xyzs);
    return this.fetchAndParse(xyzs).then(() => this.toFeatures(bbox, zoom));
  }
  entitiyLookup(entityIds: EntityId[]): Entity[] {
    const result = [];
    return entityIds
      .map(id => recursiveLookup(id, this.masterTable))
      .reduce((prev, curr) => prev.concat(curr), []);
  }
  featureLookup(entityIds: EntityId[]): any[] {
    const entities = this.entitiyLookup(entityIds);
    const entityTable: EntityTable = entityTableGen(new Map(), entities);
    const cmptProps = computePropsTable(entityTable, this.parentWays);
    const feats = entityToGeoJSON(entityTable, cmptProps);
    return feats;
  }
  private fetchAndParse(xyzs: Tile[]) {
    // @TOFIX parseXML directly mutates parentWays not good
    return Promise.all(
      xyzs.filter(t => !this.tilesCache.has(t)).map(t => this.fetchProcess(t))
    );
  }
  private fetchProcess(t: Tile) {
    return fetchTile(t.x, t.y, t.z)
      .then(xml => {
        console.time(`workerParsing=${t.x},${t.y},${t.z}`);
        return parseXML(xml, this.parentWays);
      })
      .then(e => {
        // even though parentWays is the same, because it
        // is a damn map, which is mutated directly is directly mutated.
        this.parentWays = e.parentWays;
        this.masterTable = entityTableGen(this.masterTable, e.entities);
        this.tilesCache.set(t, e.entities);
        console.timeEnd(`workerParsing=${t.x},${t.y},${t.z}`);
      });
  }
  private toFeatures(bbox: BBox, zoom: number) {
    console.time(`totalarsee`);

    const entities = this.tilesCache.search(bbox, zoom, 1);
    const entityTable: EntityTable = entityTableGen(new Map(), entities);
    const cmptProps = computePropsTable(entityTable, this.parentWays);
    const feats = entityToGeoJSON(entityTable, cmptProps);
    console.timeEnd(`totalarsee`);
    return feats;
  }
}
