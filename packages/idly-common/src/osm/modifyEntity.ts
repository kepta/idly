import { nodeFactory } from '../osm/nodeFactory';
import { relationFactory } from '../osm/relationFactory';
import { EntityType } from '../osm/structures';
import { Entity, Node, Relation, Way } from './structures';
import { wayFactory } from './wayFactory';

export function modifyEntity(entity: Entity, obj: Partial<Entity>): Entity {
  switch (entity.type) {
    case EntityType.NODE:
      return nodeFactory({
        ...entity,
        ...obj,
        id: entity.id
      });

    case EntityType.WAY:
      return wayFactory({
        ...entity,
        ...obj,
        id: entity.id
      });

    case EntityType.RELATION:
      return relationFactory({
        ...entity,
        ...obj,
        id: entity.id
      });
  }
}
