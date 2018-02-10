import { Entity, EntityType, Relation, Way } from '../../osm/structures';
import { setCreate, setUnion } from '../helper';
import { Log } from '../log';
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

export const osmStateCreate = (): State<OsmElement> => State.create();

export function osmStateAddVirgins(
  state: State<OsmElement>,
  entities: Entity[],
  quadkey: string
) {
  const osmElements = initializeElements(entities);

  // adding to element table is necessary for the next functions
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

/**
 * WARNING this and osmTableApplyParentRelations  modifies osmTable
 * This function expect the osmTable's row to have
 * already been created for each entities in the param.
 * @TOFIX It could be possible that relation (maybe way) children
 * are not present. How do we fix that? How Should we handle when the
 * missing child comes back?
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

export function osmTableApplyParentRelations(
  osmTable: OsmTable,
  parentRelationsTable: ParentRelationsTable
) {
  for (const [id, parents] of parentRelationsTable) {
    const element = tableGet(osmTable, id);
    if (!element) {
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
