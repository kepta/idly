import {
  Entity,
  EntityType,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { baseId, Log, logRewrite } from '../dataStructures/log';
import { getEntity } from '../stateHelpers/getEntity';
import { getLatestId } from '../stateHelpers/getLatestId';
import { OsmState } from '../type';
import { relationUpdateMemberId } from './pure/relationUpdateMemberId';
import { wayUpdateNodeId } from './pure/wayUpdateNodeId';
import { setFilter, setFind, setCreate } from '../dataStructures/set';

export function logIntroduceEntity(
  state: OsmState,
  entity: Way | Relation,
  childrenIds: string[]
): { log: Log; updatedEntities: Entity[] } {
  const id = getLatestId(state.log, entity.id);

  if (id !== baseId(entity.id)) {
    throw new Error('couldnt rewrite as newer entity exists ' + id);
  }

  const baseChildrenIds = childrenIds.map(baseId);

  const newLog = logRewrite(state.log, id, baseChildrenIds);

  const setChild = setCreate(baseChildrenIds);

  const log2 = logRewrite(state.log, id, baseChildrenIds)
    .reduce((prev: Array<{ currentId: string; childIds: string[] }>, entry) => {
      const presentId = setFind(r => baseId(r) === id, entry);
      if (presentId) {
        prev.push({
          childIds: [...entry].filter(e => setChild.has(baseId(e))),
          currentId: presentId,
        });
      }
      return prev;
    }, [])
    .reduceRight(
      (prev, { currentId, childIds }) => {
        const current = childIds.reduce((prev2, cur) => {
          const e1 = getEntity(baseId(cur), state) as Node;
          const e2 = getEntity(cur, state) as Node;
          if (prev2.type === EntityType.WAY) {
            return wayUpdateNodeId(e1, e2, prev2, currentId as string);
          }
          return relationUpdateMemberId(e1, e2, prev2, currentId as string);
        }, prev[prev.length - 1]);

        prev.push(current);
        return prev;
      },
      [entity] as Array<Way | Relation>
    );

  return { log: newLog, updatedEntities: log2 };
}
