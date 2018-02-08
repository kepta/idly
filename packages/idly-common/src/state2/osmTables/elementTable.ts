import { Entity, EntityType } from '../../osm/structures';
import { setCreate } from '../helper';
import { Table, tableCreate } from '../table';
import { tableAdd, tableGet } from '../table/regular';

export interface Element {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export type ElementTable = Table<Element>;

export const elementTableCreate = (): ElementTable => tableCreate();

export function elementTableBulkAdd(
  elementTable: ElementTable,
  entities: Entity[]
) {
  initializeElements(elementTable, entities);
  parentCalculate(elementTable, entities);
}

function initializeElements(t: ElementTable, entity: Entity[]) {
  for (const e of entity) {
    tableAdd(t, e.id, {
      entity: e,
      parentRelations: setCreate<string>(),
      parentWays: setCreate<string>(),
    });
  }
}

/**
 * This function expect the elementTable's row to have
 * already been created for each entities in the param.
 * @TOFIX It could be possible that relation (maybe way) children
 * are not present. How do we fix that? How Should we handle when the
 * missing child comes back?
 */
function parentCalculate(elementTable: Table<Element>, entities: Entity[]) {
  entities.reduce((prev, parentEntity) => {
    if (parentEntity.type === EntityType.WAY) {
      parentEntity.nodes.forEach(id =>
        // @TOFIX might wanna fix this as the entity could not be present
        // in the elementTable
        (tableGet(prev, id) as Element).parentWays.add(parentEntity.id)
      );
    } else if (parentEntity.type === EntityType.RELATION) {
      parentEntity.members.forEach(mem => {
        // @NOTE we dont go deep when talking about parentRelations
        // it is just 1 level to reduce complexity.
        const entity = tableGet(prev, mem.ref);
        if (entity) {
          entity.parentRelations.add(parentEntity.id);
        }
      });
    }
    return prev;
  }, elementTable);
}
