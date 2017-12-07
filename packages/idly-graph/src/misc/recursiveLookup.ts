import {
  Entity,
  EntityId,
  EntityTable,
  EntityType,
} from 'idly-common/lib/osm/structures';

export function recursiveLookup(
  id: EntityId | undefined,
  table: EntityTable,
): Entity[] {
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
    // @NOTE overriding the (Entity | undefined)[] as Entity[] assuming
    //   table would always have that node. This may or may not be correct.
    //   please check!.
    const entities = entity.nodes.map(nodeId => table.get(nodeId)) as Entity[];
    entities.push(entity);
    return entities;
  } else {
    const entities = entity.members
      .map(member => {
        // if member is relation dont dive deeper,
        // @TODO I don't really know the schema of member
        // is it id=x or ref=x. Figure it out?
        if (!member.id) {
          return [];
        }
        if (member.type === EntityType.RELATION) {
          const relation = table.get(member.id); // TOFIX when does member not have id
          if (relation) {
            return [relation];
          } else {
            return [];
          }
        }
        return recursiveLookup(member.id, table);
      })
      .reduce((prev, curr) => prev.concat(curr), []);

    entities.push(entity);
    return entities;
  }
}
