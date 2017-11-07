// ref iD implementation
import { Tree } from '../../graph/Tree';

export function deleteNode(nodeId: string) {
  return (tree: Tree) => {
    const node = tree.entity(nodeId);

    // tree.parentWays(node).forEach(function(parent) {});

    // @TOFIX add relation logic

    return tree.remove(node);
  };
}
