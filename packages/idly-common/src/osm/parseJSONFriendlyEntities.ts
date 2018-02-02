import { nodeFactory } from './entityFactory/nodeFactory';
import { relationFactory } from './entityFactory/relationFactory';
import { tagsFactory } from './entityFactory/tagsFactory';
import { wayFactory } from './entityFactory/wayFactory';

import { Entity, EntityType } from '../osm/structures';

export function parseJSONFriendlyEntities(
  parsedEntities: Array<{
    string: any;
    tags: string;
  }>,
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
