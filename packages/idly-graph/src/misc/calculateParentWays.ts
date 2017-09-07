import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import {
  EntityTable,
  EntityType,
  ParentWays,
} from 'idly-common/lib/osm/structures';

export function calculateParentWays(
  entityTable: EntityTable,
  parentWays: ParentWays = ImMap(),
): ParentWays {
  return parentWays.withMutations(p => {
    entityTable.forEach(w => {
      if (!w || w.type !== EntityType.WAY) {
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
