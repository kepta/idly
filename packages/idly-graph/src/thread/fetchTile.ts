import { Tile } from 'idly-common/lib/geo/tile';
import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { DOMParser } from 'xmldom';

import { calculateParentWays } from '../misc/calculateParentWays';
import { tileId } from '../misc/tileId';
import { TileData, TilesDataTable } from '../operations/operationsTypes';
import { fetchTileXml } from './fetchTileXml';
import { xmlToEntities } from './xmlToEntities';
import { smartParser } from './smartParser';
import diff from 'deep-diff';

function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function(result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}
export async function fetchTile(
  x: number,
  y: number,
  z: number,
): Promise<TileData> {
  const xml = await fetchTileXml(x, y, z);
  console.time('diff1');
  const entities = smartParser(xml);
  console.timeEnd('diff1');

  if (false) {
    console.time('diff2');
    const xmlParse = new DOMParser().parseFromString(xml, 'text/xml');
    const en2 = xmlToEntities(xmlParse);
    console.timeEnd('diff2');

    console.log('got diff', diff(en2, entities));
  }

  const entityTable = entityTableGen(entities);
  const parentWays = calculateParentWays(entityTable);
  return { entities, entityTable, parentWays };
}

// TOFIX handle not caching when project.rejects
export function cacheFetchTile(
  tilesDataTable: TilesDataTable,
  tiles: Tile[],
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
    // tslint:disable-next-line:no-expression-statement
    tilesDataTable = tilesDataTable.set(str, res);
    return res;
  });
  return { tilesDataTable, tilesData };
}
