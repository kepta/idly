import { Entity } from 'idly-common/lib/osm/structures';

import { Tree } from '../graph/Tree';

export function addEntity(entity: Entity): (t: Tree) => Tree {
  return tree => tree.replace(entity);
}
