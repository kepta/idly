import { Set as ImSet } from 'immutable';

import { Leaf } from '../Leaf';
import { Tree } from '../Tree';

export function getAbsent(tree: Tree): ImSet<Leaf> {
  return tree.getOldLeaves();
}
