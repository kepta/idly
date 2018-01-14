import { nodeFactory } from '../osm/nodeFactory';
import { relationFactory } from '../osm/relationFactory';
import { EntityType } from '../osm/structures';
import { Entity } from './structures';
import { wayFactory } from './wayFactory';

export function entityFromStringCache() {
  const cache = new Map();
  return (strEntity: string): Entity => {
    if (cache.has(strEntity)) {
      return cache.get(strEntity);
    }
    const entity = _entityFromString(JSON.parse(strEntity));
    cache.set(strEntity, entity);
    return entity;
  };
}

export const entityFromString = entityFromStringCache();

function _entityFromString(entity: any): Entity {
  if (!entity.id) {
    throw new Error('not a valid entity');
  }

  switch (entity.type) {
    case EntityType.NODE:
      return nodeFactory(entity);

    case EntityType.WAY:
      return wayFactory(entity);

    case EntityType.RELATION:
      return relationFactory(entity);

    default:
      throw new Error('not a valid entity');
  }
}
