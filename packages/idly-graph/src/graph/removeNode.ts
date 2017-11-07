import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { Tree } from './Tree';

export function removeNode(tree: Tree, id: string): Tree {
  const treeObj = tree.toObject();
  let { entityTable } = treeObj;

  const parent = parentWays.get(id);

  if (parent) {
    const ways = parent.map((wayId = '') => {
      const way = this.get(wayId) as Way;
      if (!way) {
        throw new Error('way' + wayId + ' must be in the knownIds');
      }
      // tslint:disable-next-line:no-expression-statement
      entityTable = entityTable.set(
        wayId,
        wayFactory(
          Object.assign({}, way, {
            nodes: way.nodes.filter(n => n === id),
          }),
        ),
      );
    });
  }
  return Tree.fromObject({
    deletedIds: this._deletedIds.add(id),
    entityTable: entityTable.remove(id),
    knownIds: this._knownIds.remove(id),
  });
}
