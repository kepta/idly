import {
  Entity,
  EntityType,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { Iterable, Set as ImSet } from 'immutable';

import { Leaf } from '../../graph/Leaf';
import { Tree } from '../../graph/Tree';

// @TOFIX divergent leaves !!
export function modifyLeaf(
  tree: Tree,
): (
  leaf: Leaf,
  opt?: {
    readonly dependants: Leaf[];
  },
) => Tree {
  return (leaf, opt) => {
    const entity = leaf.getEntity();
    wayCheck(entity, tree, opt);

    // remove any previous ancestor of the entity in the view
    const newBranch = tree.getBranch().subtract(leaf.getAllAncestors());
    return tree.newBranch(newBranch.add(leaf));
  };
}

function wayCheck(
  entity: Entity,
  tree: Tree,
  opt?: {
    readonly dependants: Leaf[];
  },
): void {
  if (entity.type !== EntityType.WAY) {
    return;
  }
  if (!opt || !opt.dependants) {
    throw new Error(
      'please pass the node members wrapped in a leaf for the way ' + entity.id,
    );
  }
  const nodeLeaves = opt.dependants;
  const dependant = ImSet(nodeLeaves);
  const currentBranch = tree.getBranch();
  // tslint:disable-next-line:no-expression-statement
  console.log(
    'warning ! the following ids',
    dependant
      .subtract(currentBranch)
      .map(leaf => {
        // tslint:disable-next-line:no-unused-expression
        return leaf && leaf.getEntity().id;
      })
      .toJS()
      .join(','),
    ' were not found in the current, make sure you added them to the branch before changing the way',
    entity.id,
  );
}
