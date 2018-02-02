import { EntityType } from '../osm/structures';
import { nodeFactory } from './entityFactory/nodeFactory';
import { relationFactory } from './entityFactory/relationFactory';
import { wayFactory } from './entityFactory/wayFactory';
import { Entity } from './structures';

export function entityFromStringCache(): (strEntity: string) => Entity {
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

export const entityFromString: (
  strEntity: string
) => Entity = entityFromStringCache();

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
