import { BBox } from 'idly-common/lib/geo/bbox';
import { bboxToTiles } from 'idly-common/lib/geo/bboxToTiles';
import { Tile } from 'idly-common/lib/geo/tile';
import { ImMap } from 'idly-common/lib/misc/immutable';
import { weakCache2 } from 'idly-common/lib/misc/weakCache';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity, EntityId, EntityTable, ParentWays } from 'idly-common/lib/osm/structures';

import { entityToFeature } from '../../thread/entityToFeatures';
import { fetchTileXml } from '../../thread/fetchTileXml';
import { stubParser } from '../../thread/xmlToEntities';
import { TilesCache } from '../store/tilesCache';
import { recursiveLookup } from '../util/recursiveLookup';

// tslint:disable
export class Manager {
  private tilesCache = new TilesCache();
  private parentWays: ParentWays = ImMap();
  private masterTable: EntityTable = ImMap();
  public pluginsWorker: Promise<any[]>;
  constructor(pluginPromise: Promise<any>) {
    this.pluginsWorker = pluginPromise.then(plugs => {
      if (!plugs) {
        console.error('empty plugin promise');
        return [];
      }
      return plugs.workers.map(w => {
        if (!w || !w.worker || !w.pluginName) throw new Error('empty worker');
        return {
          ...w,
          worker: weakCache2(w.worker),
        };
      });
    });
  }

  async receive(bbox: BBox, zoom: number) {
    zoom = 18;
    zoom = Math.floor(zoom);
    const xyzs = bboxToTiles(bbox, zoom);
    console.time('nonlethal');
    await Promise.all(
      xyzs.filter(t => !this.tilesCache.has(t)).map(t => this.fetchProcess(t)),
    );
    const entities = this.tilesCache.search(bbox, zoom, 1);
    const ret = this.computePropsTable(
      entityTableGen(entities),
      this.parentWays,
    );
    console.timeEnd('nonlethal');
    return ret;
  }

  entityLookup(entityIds: EntityId[]): Entity[] {
    const result = [];
    return entityIds
      .map(id => recursiveLookup(id, this.masterTable))
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  featureLookup(entityIds: EntityId[]): Promise<any[]> {
    const entities = this.entityLookup(entityIds);
    const entityTable: EntityTable = entityTableGen(entities);
    return this.computePropsTable(entityTable, this.parentWays);
  }

  private async computePropsTable(
    entityTable: EntityTable,
    parentWays: ParentWays,
  ): Promise<Map<EntityId, { [index: string]: string }>> {
    console.time('computePropsTable');
    const workerPlugins = await this.pluginsWorker;
    const p = entityToFeature(workerPlugins.map(r => r.worker))(entityTable);
    console.timeEnd('computePropsTable');
    return p;
  }

  private async fetchProcess(t: Tile) {
    const xml = await fetchTileXml(t.x, t.y, t.z);
    const { entities, parentWays } = stubParser(xml, this.parentWays);
    this.parentWays = parentWays;
    this.masterTable = entityTableGen(entities, this.masterTable);
    this.tilesCache.set(t, entities);
  }
}
