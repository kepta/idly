import { nodeFactory } from '../osm/nodeFactory';
import { relationFactory } from '../osm/relationFactory';
import { EntityType, Tags } from '../osm/structures';
import { Entity, Node, Relation, Way } from './structures';
import { tagsFactory } from './tagsFactory';
import { wayFactory } from './wayFactory';

export function entityFactory(entity: any): Entity {
  if (!entity.id) {
    throw new Error('not a valid entity');
  }

  if (typeof entity.tags === 'string') {
    entity.tags = tagsFactory(JSON.parse(entity.tags));
  } else if (Array.isArray(entity.tags)) {
    entity.tags = tagsFactory(entity.tags);
  } else if (!entity.hasOwnProperty('tags')) {
    entity.tags = tagsFactory([]);
  }

  if (!(entity.tags instanceof Tags)) {
    throw new Error('not proper tags');
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
