import { Iterable, Set as ImSet } from 'immutable';

import { Leaf } from './Leaf';
import { Tree } from './Tree';

export function getPresent(tree: Tree): ImSet<Leaf> {
  return tree.getLeaves();
}
