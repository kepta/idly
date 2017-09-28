import { entityFactory } from 'idly-common/lib/osm/entityFactory';
import { EntityId, Tags } from 'idly-common/lib/osm/structures';
import { Tree } from '../graph/Tree';

export function changeTags(entityId: EntityId, tags: Tags): (t: Tree) => Tree {
  return tree => {
    const entity = tree.entity(entityId);
    if (!entity) {
      return tree;
    }
    return tree.replace(entityFactory({ ...entity, tags }));
  };
}
