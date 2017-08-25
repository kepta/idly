import { Entity, EntityId, EntityTable, EntityType } from 'idly-common/lib';

export function recursiveLookup(id: EntityId, table: EntityTable): Entity[] {
  const entity = table.get(id);
  if (entity.type === EntityType.NODE) {
    return [entity];
  }
  if (entity.type === EntityType.WAY) {
    const entities = entity.nodes.map(nodeId => table.get(nodeId));

    entities.push(entity);
    return entities;
  }
  if (entity.type === EntityType.RELATION) {
    const entities = entity.members
      .map(member => recursiveLookup(member.id, table))
      .reduce((prev, curr) => prev.concat(curr), []);

    entities.push(entity);
    return entities;
  }
}
