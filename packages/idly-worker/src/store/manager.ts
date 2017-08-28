import { BBox } from 'idly-common/lib/geo/bbox';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import {
  Entity,
  EntityId,
  EntityTable,
  ParentWays
} from 'idly-common/lib/osm/structures';

import { parseXML } from '../parsing/parser';

import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { Tile } from 'idly-common/lib/geo/tile';
// import { onParseEntities } from 'idly-osm/lib/worker';

import { entityToGeoJSON } from '../geojson/entityToGeoJSON';
import { fetchTile } from '../parsing/fetch';
import { TilesCache } from '../store/tilesCache';
import { recursiveLookup } from '../util/recursiveLookup';

export class Manager {
  private tilesCache = new TilesCache();
  private parentWays: ParentWays = new Map();
  private masterTable: EntityTable = new Map();
  private pluginsWorker: Promise<any[]>;
  constructor(pluginPromise: Promise<any>) {
    console.log(pluginPromise);
    this.pluginsWorker = pluginPromise.then(x => {
      if (!x) {
        console.error('empty plugin promise');
        return [];
      }
      return x.workers.map(w => {
        if (!w || !w.worker || !w.pluginName) throw new Error('empty worker');
        return w;
      });
    });
  }
  receive(bbox: BBox, zoom: number) {
    zoom = Math.floor(zoom);
    const xyzs = bboxToTiles(bbox, zoom);
    console.log(bbox, zoom, xyzs);
    return this.fetchAndParse(xyzs).then(() => this.toFeatures(bbox, zoom));
  }
  entityLookup(entityIds: EntityId[]): Entity[] {
    const result = [];
    return entityIds
      .map(id => recursiveLookup(id, this.masterTable))
      .reduce((prev, curr) => prev.concat(curr), []);
  }
  async featureLookup(entityIds: EntityId[]): Promise<any[]> {
    const entities = this.entityLookup(entityIds);
    const entityTable: EntityTable = entityTableGen(new Map(), entities);
    const cmptProps = await this.computePropsTable(
      entityTable,
      this.parentWays
    );
    const feats = entityToGeoJSON(entityTable, cmptProps);
    return feats;
  }
  private async computePropsTable(
    t: EntityTable,
    p: ParentWays
  ): Promise<Map<EntityId, { [index: string]: string }>> {
    console.time('computePropsTable');
    const props = new Map();
    const workerPlugins = await this.pluginsWorker;
    for (const { worker } of workerPlugins) {
      const computedProps = worker(t, p);
      for (const [entityId, val] of computedProps) {
        if (props.has(entityId)) {
          props.get(entityId).push(val);
        } else {
          props.set(entityId, [val]);
        }
      }
    }
    for (const [key, val] of props) {
      props.set(key, Object.assign({}, ...val));
    }
    console.timeEnd('computePropsTable');
    return props;
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
  private async toFeatures(bbox: BBox, zoom: number) {
    console.time(`worker.toFeatures`);

    const entities = this.tilesCache.search(bbox, zoom, 1);
    const entityTable: EntityTable = entityTableGen(new Map(), entities);
    const cmptProps = await this.computePropsTable(
      entityTable,
      this.parentWays
    );
    const feats = entityToGeoJSON(entityTable, cmptProps);
    console.timeEnd(`worker.toFeatures`);
    return feats;
  }
}
