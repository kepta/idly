import { Entity, EntityId, EntityTable, EntityType } from 'idly-common/lib/osm/structures';

export function recursiveLookup(
  id: EntityId | undefined,
  table: EntityTable,
): Array<Entity | undefined> {
  if (!id) {
    return [];
  }
  const entity = table.get(id);

  if (!entity) {
    return [];
  }

  if (entity.type === EntityType.NODE) {
    return [entity];
  }
  if (entity.type === EntityType.WAY) {
    const entities = entity.nodes.map(nodeId => table.get(nodeId));
    // tslint:disable-next-line:no-expression-statement
    entities.push(entity);
    return entities;
  } else {
    const entities = entity.members
      .map(member => {
        if (member.type === EntityType.RELATION) {
          const relation = table.get(member.id); // TOFIX when does member not have id
          return [relation];
        }
        return recursiveLookup(member.id, table);
      })
      .reduce((prev, curr) => prev.concat(curr), []);

    // tslint:disable-next-line:no-expression-statement
    entities.push(entity);
    return entities;
  }
}
