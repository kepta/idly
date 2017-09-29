import { deepFreeze } from '../misc/deepFreeze';
import { nodeFactory } from './nodeFactory';
import { relationFactory } from './relationFactory';
import { tagsFactory } from './tagsFactory';
import { wayFactory } from './wayFactory';

import { Entity, EntityType, Tags } from '../osm/structures';

export function parseJSONFriendlyEntities(
  parsedEntities: Array<{
    string: any;
    tags: string;
  }>
): Entity[] {
  return parsedEntities.map((entity: any) => {
    entity.tags = tagsFactory(JSON.parse(entity.tags));
    switch (entity.type) {
      case EntityType.NODE:
        return nodeFactory(entity);

      case EntityType.WAY:
        return wayFactory(entity);

      case EntityType.RELATION:
        return relationFactory(entity);
      default: {
        throw new Error('unknown entity, please send entity like structs only');
      }
    }
  });
}