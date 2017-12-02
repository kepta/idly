import { Entity } from '../../../osm/structures';

import { Leaf } from '../../graph/Leaf';
import { Tree } from '../../graph/Tree';

export function addNewEntity(tree: Tree): (e: Entity) => Tree {
  return entity => {
    return tree.newBranch(tree.getBranch().add(Leaf.create(entity)));
  };
}
