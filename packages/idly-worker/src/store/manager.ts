import { Feature } from 'idly-common/lib/osm/feature';

import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { Tile } from 'idly-common/lib/geo/tile';
import { weakCache2 } from 'idly-common/lib/misc/weakCache';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import {
  Entity,
  EntityId,
  EntityTable,
  ParentWays
} from 'idly-common/lib/osm/structures';

import { ImMap } from 'idly-common/lib/misc/immutable';
import { entityToGeoJSON } from '../geojson/entityToGeoJSON';
import { fetchTile } from '../parsing/fetch';
import { parseXML } from '../parsing/parser';
import { TilesCache } from '../store/tilesCache';
import { recursiveLookup } from '../util/recursiveLookup';

export class Manager {
  private tilesCache = new TilesCache();
  private parentWays: ParentWays = ImMap();
  private masterTable: EntityTable = ImMap();
  private pluginsWorker: Promise<any[]>;
  constructor(pluginPromise: Promise<any>) {
    this.pluginsWorker = pluginPromise.then(x => {
      if (!x) {
        console.error('empty plugin promise');
        return [];
      }
      return x.workers.map(w => {
        if (!w || !w.worker || !w.pluginName) throw new Error('empty worker');
        return {
          ...w,
          worker: weakCache2(w.worker)
        };
      });
    });
  }
  receive(bbox: BBox, zoom: number) {
    zoom = 18;
    zoom = Math.floor(zoom);
    const xyzs = bboxToTiles(bbox, zoom);
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
    const entityTable: EntityTable = entityTableGen(entities);
    const cmptProps = await this.computePropsTable(
      entityTable,
      this.parentWays
    );
    const feats = entityToGeoJSON(entityTable, cmptProps);
    return feats;
  }
  private async computePropsTable(
    entityTable: EntityTable,
    parentWays: ParentWays
  ): Promise<Map<EntityId, { [index: string]: string }>> {
    console.time('computePropsTable');
    const props = new Map();
    const workerPlugins = await this.pluginsWorker;
    for (const { worker } of workerPlugins) {
      const computedProps = worker(entityTable, parentWays);
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
    return Promise.all(
      xyzs.filter(t => !this.tilesCache.has(t)).map(t => this.fetchProcess(t))
    );
  }
  private fetchProcess(t: Tile) {
    return fetchTile(t.x, t.y, t.z)
      .then(xml => {
        console.time(`parsingTile=${t.x},${t.y},${t.z}`);
        return parseXML(xml, this.parentWays);
      })
      .then(e => {
        if (!e) return;
        this.parentWays = e.parentWays;
        this.masterTable = entityTableGen(e.entities, this.masterTable);
        this.tilesCache.set(t, e.entities);
        console.timeEnd(`parsingTile=${t.x},${t.y},${t.z}`);
      });
  }
  private async toFeatures(bbox: BBox, zoom: number) {
    console.time(`worker.toFeatures`);
    const entities = this.tilesCache.search(bbox, zoom, 1);
    const entityTable: EntityTable = entityTableGen(entities);
    const cmptProps = await this.computePropsTable(
      entityTable,
      this.parentWays
    );
    const feats = entityToGeoJSON(entityTable, cmptProps);
    console.timeEnd(`worker.toFeatures`);
    return feats;
  }
}
