import { Entity, EntityType } from '../../osm/structures';
import { setCreate } from '../helper';
import { Log } from '../log';
import { State } from '../osmTables/state';
import { Table } from '../table';
import { tableGet } from '../table/regular';

export interface OsmElement {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export type OsmTable = Table<OsmElement>;

export const OsmStateCreate = (): State<OsmElement> => State.create();

export function osmStateAddVirgins(
  state: State<OsmElement>,
  entities: Entity[],
  quadkey: string
) {
  const osmElements = initializeElements(entities);
  state.add(e => e.entity.id, osmElements, quadkey);
  unsafeParentCalculate(state.getElementTable(), osmElements);
}

export function OsmStateAddModifieds(
  state: State<OsmElement>,
  newLog: Log,
  modifiedEntities: Entity[]
) {
  if (newLog.length === 0) {
    return;
  }
  // check if modified entities tally with latest log
  const latestEntry = newLog[0];

  if (
    latestEntry.size !== modifiedEntities.length ||
    modifiedEntities.some(r => !latestEntry.has(r.id))
  ) {
    throw new Error('log and modifiedEntities dont match');
  }

  modifiedEntities.forEach(e => {
    if (state.getElement(e.id)) {
      throw new Error(`Modified ${e.id} already exists in table`);
    }
  });
  osmStateAddVirgins(state, modifiedEntities, '');
}
/**
 * WARNING this modifies osmTable
 * This function expect the osmTable's row to have
 * already been created for each entities in the param.
 * @TOFIX It could be possible that relation (maybe way) children
 * are not present. How do we fix that? How Should we handle when the
 * missing child comes back?
 */
function unsafeParentCalculate(osmTable: OsmTable, osmElements: OsmElement[]) {
  osmElements.reduce((prev, current) => {
    if (current.entity.type === EntityType.WAY) {
      current.entity.nodes.forEach(id => {
        // @TOFIX might wanna fix this as the entity could not be present
        // in the osmTable
        (tableGet(prev, id) as OsmElement).parentWays.add(current.entity.id);
      });
    } else if (current.entity.type === EntityType.RELATION) {
      current.entity.members.forEach(mem => {
        // @NOTE we dont go deep when talking about parentRelations
        // it is just 1 level to reduce complexity.
        const entity = tableGet(prev, mem.ref);
        if (entity) {
          entity.parentRelations.add(current.entity.id);
        }
      });
    }
    return prev;
  }, osmTable);
}

const initializeElements = (entities: Entity[]) =>
  entities.map(e => ({
    entity: e,
    parentRelations: setCreate<string>(),
    parentWays: setCreate<string>(),
  }));
