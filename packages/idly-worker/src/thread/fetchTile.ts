import { Tile } from 'idly-common/lib/geo/tile';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { smartParser } from 'idly-faster-osm-parser';

import { calculateParentWays } from '../misc/calculateParentWays';
import { tileId } from '../misc/tileId';
import { TileData, TilesDataTable } from '../operations/operationsTypes';
import { fetchTileXml } from './fetchTileXml';

export async function fetchTile(
  x: number,
  y: number,
  z: number
): Promise<TileData> {
  const xml = await fetchTileXml(x, y, z);
  const entities = smartParser(xml);

  const entityTable = entityTableGen(entities);
  const parentWays = calculateParentWays(entityTable);
  return { entities, entityTable, parentWays };
}

// TOFIX handle not caching when project.rejects
export function cacheFetchTile(
  tilesDataTable: TilesDataTable,
  tiles: Tile[]
): {
  readonly tilesDataTable: TilesDataTable;
  readonly tilesData: Array<Promise<TileData>>;
} {
  const tilesData = tiles.map(({ x, y, z }) => {
    const str = tileId({ x, y, z });
    const cached = tilesDataTable.get(str);
    if (cached) {
      return cached;
    }
    const res = fetchTile(x, y, z);
    tilesDataTable = tilesDataTable.set(str, res);
    return res;
  });
  return { tilesDataTable, tilesData };
}
