import { nodeFactory } from '../osm/nodeFactory';
import { relationFactory } from '../osm/relationFactory';
import { EntityType } from '../osm/structures';
import { Entity, Node, Relation, Way } from './structures';
import { tagsFactory } from './tagsFactory';
import { wayFactory } from './wayFactory';

export function entityFactoryCache() {
  const cache = new Map();
  return (strEntity: string): Entity => {
    if (cache.has(strEntity)) {
      return cache.get(strEntity);
    }
    const entity = entityFactory(JSON.parse(strEntity));
    cache.set(strEntity, entity);
    return entity;
  };
}

export function entityFactory(entity: any): Entity {
  if (!entity.id) {
    throw new Error('not a valid entity');
  }

  if (typeof entity.tags === 'string') {
    entity.tags = tagsFactory(JSON.parse(entity.tags));
  } else if (!entity.hasOwnProperty('tags')) {
    entity.tags = tagsFactory();
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
