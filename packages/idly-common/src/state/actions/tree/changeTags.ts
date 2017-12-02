import { Leaf } from '../../graph/Leaf';
import { Tree } from '../../graph/Tree';
import { modifyLeaf } from './modifyLeaf';
import { Tags } from '../../../osm/structures';

export function changeTags(tags: Tags, leaf: Leaf) {
  return (tree: Tree) => {
    const newLeaf = leaf.map(entity => ({
      ...entity,
      tags,
    }));
    return modifyLeaf(tree)(newLeaf);
  };
}
