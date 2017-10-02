import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';

import { Tree } from './Tree';

// tslint:disable no-expression-statement
describe('Tree.isEqual', () => {
  test('isEqual simple', () => {
    const node = nodeFactory({ id: 'n-1' });
    const tree = Tree.fromEntities([node]);
    const treeCopy = Tree.fromEntities([node]);
    const treeNotCopy = Tree.fromEntities([nodeFactory({ id: 'n-2' })]);
    expect(tree.isEqual(treeCopy)).toBe(true);
    expect(tree.isEqual(tree)).toBe(true);
    expect(tree.isEqual(treeNotCopy)).toBe(false);
  });
});

describe('Tree.merge', () => {
  test('merge simple', () => {
    const node1 = nodeFactory({ id: 'n-1' });
    const tree1 = Tree.fromEntities([node1]);
    const node2 = nodeFactory({ id: 'n-2' });
    const tree2 = Tree.fromEntities([node2]);
    expect(
      tree1.merge(tree2).isEqual(Tree.fromEntities([node2, node1])),
    ).toEqual(true);
  });
});
