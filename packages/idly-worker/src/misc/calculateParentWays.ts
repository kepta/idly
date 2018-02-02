import { Map as ImMap, Set as ImSet } from 'immutable';

import {
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/immutableStructures';
import { EntityId, EntityType } from 'idly-common/lib/osm/structures';

export function calculateParentWays(
  entityTable: EntityTable,
  deletedIds: ImSet<EntityId> = ImSet(),
  parentWays: ParentWays = ImMap()
): ParentWays {
  return parentWays.withMutations(p => {
    entityTable.forEach(w => {
      if (!w || w.type !== EntityType.WAY || deletedIds.has(w.id)) {
        return;
      }
      w.nodes.forEach(nodeId => {
        /* tslint:disable */
        p.update(nodeId, (s = ImSet()) => s.add(w.id));
        /* tslint:enable */
      });
    });
  });
}
