import { Entity } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/tree';

export function addEntity(entity: Entity): (t: Tree) => Tree {
  return tree => tree.replace(entity);
}
