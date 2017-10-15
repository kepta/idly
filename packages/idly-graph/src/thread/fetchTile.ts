import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { Entity, EntityTable, ParentWays } from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';
import { fetchTileXml } from './fetchTileXml';
import { xmlToEntities } from './xmlToEntities';

export async function fetchTile(
  x: number,
  y: number,
  z: number,
): Promise<{
  readonly entities: Entity[];
  readonly entityTable: EntityTable;
  readonly parentWays: ParentWays;
}> {
  const xml = await fetchTileXml(x, y, z);
  const entities = xmlToEntities(xml);
  const entityTable = entityTableGen(entities);
  const parentWays = calculateParentWays(entityTable);
  return { entities, entityTable, parentWays };
}
