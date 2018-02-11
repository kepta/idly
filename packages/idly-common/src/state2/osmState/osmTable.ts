import { Entity, EntityType, Relation, Way } from '../../osm/structures';
import { setCreate, setEqual, setSome, setUnion } from '../helper';
import {
  Log,
  logGetLatestModifiedIds,
  logGetVirginIdsOfModifiedIds,
} from '../log';
import { State } from '../state/state';
import {
  OneToManyTable,
  oneToManyTableCreate,
  oneToManyTableInsert,
  Table,
} from '../table';
import { tableAdd, tableGet } from '../table/regular';

export interface OsmElement {
  readonly entity: Entity;
  readonly parentRelations: Set<string>;
  readonly parentWays: Set<string>;
}
export type ParentWaysTable = OneToManyTable<string>;
export type ParentRelationsTable = OneToManyTable<string>;

export interface OsmElementWay {
  readonly entity: Way;
  readonly parentRelations: Set<string>;
  readonly parentWays: Set<string>;
}

export type OsmTable = Table<OsmElement>;

export const osmStateCreate = (): Stsrate<OsmElement> => State.create();

export function osmStateAddVirgins(
  state: State<OsmElement>,
  entities: Entity[],
  quadkey: string
) {
  const osmElements = initializeElements(entities);

  // adding to element table is necessary for the next functions
  // const table = state.getElementTable();
  state.add(e => e.entity.id, osmElements, quadkey);

  osmTableApplyParentWays(
    state.getElementTable(),
    parentWaysTableCreate(entities)
  );
  osmTableApplyParentRelations(
    state.getElementTable(),
    parentRelationsTableCreate(entities)
  );
}

export function osmStateAddModifieds(
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

export const osmStateGetVisible = (
  state: State<OsmElement>,
  quadkeys: string[],
  log: Log
): OsmTable => {
  const visibleIds = state.getVisible(quadkeys);

  const toRemoveIds = logGetVirginIdsOfModifiedIds(log);

  for (const id of toRemoveIds) {
    visibleIds.delete(id);
  }

  for (const id of logGetLatestModifiedIds(log)) {
    visibleIds.add(id);
  }

  // return visibleIds;
  const table = state.getElementTable();
  const result: OsmTable = new Map();

  for (const id of visibleIds) {
    const e = table.get(id) as OsmElement;

    if (e.entity.type === EntityType.WAY) {
      e.entity.nodes.forEach(n => {
        result.set(n, table.get(n) as OsmElement);
      });
    } else if (e.entity.type === EntityType.RELATION) {
      // TODO
    }
    result.set(id, e);
  }
  return result;
};

// PROBLEM, whenever we shred, we might
// loose virgin enttities reference by modfied Entities
// for eg w1#1 might refer to n1 in a different quadkey
// but when you remove all all non visible quadkeys
// n1 will get removed and causing problem. As a solution
// I was thinking of finding all the quadkeys indirectly referenced
// modififed entities and keeping them alive.
// To test we dont remove '' key
// const shreddedQuadkeyTable = quadkeysTableCreateFrom(
//   this._quadkeysTable,
//   quadkey
// );
export function osmStateShred(
  state: State<OsmElement>,
  quadkey: string,
  log: Log
) {
  const newState = state.shred(quadkey);
}
/**
 * WARNING this and osmTableApplyParentRelations  modifies osmTable
 * This function expect the osmTable's row to have
 * already been created for each entities in the param.
 * @TOFIX It could be possible that relation (maybe way) children
 * are not present. How do we fix that? How Should we handle when the
 * missing child comes back?
 *
 * From the OSM docs:
 * All ways that reference at least one node that is inside a given bounding box,
 *  any relations that reference them [the ways], and any nodes outside the bounding
 *  box that the ways may reference.
 */
export function osmTableApplyParentWays(
  osmTable: OsmTable,
  parentWaysTable: ParentWaysTable
) {
  for (const [id, parents] of parentWaysTable) {
    const element = tableGet(osmTable, id);
    if (!element) {
      throw new Error('couldnt find the element in table' + id);
    }

    if (setSome(i => !element.parentWays.has(i), parents) && parents.size > 0) {
      tableAdd(
        osmTable,
        element.entity.id,
        osmElementFork(
          element.entity,
          setUnion(element.parentWays, parents),
          element.parentRelations
        )
      );
    }
  }
}

export function osmTableApplyParentRelations(
  osmTable: OsmTable,
  parentRelationsTable: ParentRelationsTable
) {
  for (const [id, parents] of parentRelationsTable) {
    const element = tableGet(osmTable, id);
    if (!element) {
      continue;
    }

    if (setEqual(parents, element.parentRelations)) {
      continue;
    }

    tableAdd(
      osmTable,
      element.entity.id,
      osmElementFork(
        element.entity,
        element.parentWays,
        setUnion(element.parentRelations, parents)
      )
    );
  }
}

const initializeElements = (entities: Entity[]): OsmElement[] =>
  entities.map(e => osmElementFork(e));

const osmElementFork = (
  entity: Entity,
  parentWays: Set<string> = setCreate<string>(),
  parentRelations: Set<string> = setCreate<string>()
): OsmElement => ({
  entity,
  parentRelations,
  parentWays,
});

export type ParentRelationsTableCreate = (
  entities: Entity[]
) => ParentRelationsTable;

export const parentRelationsTableCreate: ParentRelationsTableCreate = entities => {
  const memebersReduce = (
    relation: Relation,
    parentWays: ParentWaysTable
  ): ParentWaysTable =>
    relation.members.reduce(
      (pWays, member) => oneToManyTableInsert(pWays, member.id, relation.id),
      parentWays
    );

  return entities.reduce(
    (parentWays, entity) =>
      entity.type !== EntityType.RELATION
        ? parentWays
        : memebersReduce(entity, parentWays),
    oneToManyTableCreate<string>()
  );
};

export type ParentWaysTableCreate = (entities: Entity[]) => ParentWaysTable;

export const parentWaysTableCreate: ParentWaysTableCreate = entities => {
  const nodesReduce = (
    way: Way,
    parentWays: ParentWaysTable
  ): ParentWaysTable =>
    way.nodes.reduce(
      (pWays, nodeId) => oneToManyTableInsert(pWays, nodeId, way.id),
      parentWays
    );

  return entities.reduce(
    (parentWays, entity) =>
      entity.type !== EntityType.WAY
        ? parentWays
        : nodesReduce(entity, parentWays),
    oneToManyTableCreate<string>()
  );
};
