import { Entity, LngLat } from 'idly-common/lib/osm/structures';
import {
  entitiesMakeParentRelationsLookup,
  entityIdParentWays,
} from '../state/derivedTable/helpers';
import { genNextId } from '../stateHelpers/genNextId';
import { getLatestId } from '../stateHelpers/getLatestId';
import { OsmState } from '../type';
import { nodeMoveOp } from './operations/nodeMove';

export function nodeMove(
  state: OsmState,
  nodeId: string,
  loc: LngLat
): Entity[] {
  const id = getLatestId(state.log, nodeId);
  const derived = state.derivedTable.get(id);

  if (!derived) {
    throw new Error('couldnt create entry as no derived values found' + id);
  }

  const relationsLookup = entitiesMakeParentRelationsLookup(
    [id, ...derived.parentWays],
    state.derivedTable
  );

  return nodeMoveOp({
    idGen: (e: Entity) => genNextId(state, e.id),
    newLoc: loc,
    parentRelationsLookup: relationsLookup,
    parentWays: entityIdParentWays(id, state.derivedTable),
    prevNode: derived.entity as any,
  });
}
