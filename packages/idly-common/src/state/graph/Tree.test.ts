// tslint:disable no-expression-statement
import { Set as ImSet } from 'immutable';
import { createNode } from '../actions/entity/createEntity';
import { modifyLeaf } from '../actions/tree/modifyLeaf';
import { Leaf } from './Leaf';
import { Tree } from './Tree';

describe('getOldLeaves', () => {
  const n = createNode({ id: 'n' });
  const leaf1 = Leaf.create(n);
  let tree = Tree.create(leaf1);
  it('empty old leaves', () => {
    expect(tree.getOldLeaves()).toEqual(ImSet([]));
    expect(tree.getDepth()).toBe(1);
  });
  const leaf2 = leaf1.map(entity => createNode({ id: 'n', tags: { k: '2' } }));
  it('gets old leaves 1', () => {
    tree = modifyLeaf(tree)(leaf2);
    expect(tree.getOldLeaves()).toEqual(ImSet([leaf1]));
  });

  const leaf3 = leaf2.map(entity => createNode({ id: 'n', tags: { k: '3' } }));
  it('gets old leaves 2', () => {
    tree = modifyLeaf(tree)(leaf3);
    expect(tree.getOldLeaves().toJS()).toEqual(ImSet([leaf2, leaf1]).toJS());
  });

  const leaf4 = leaf3.map(entity => createNode({ id: 'n', tags: { k: '4' } }));

  it('gets old leaves 4', () => {
    tree = modifyLeaf(tree)(leaf4);
    expect(tree.getOldLeaves().toJS()).toEqual(
      ImSet([leaf3, leaf2, leaf1]).toJS(),
    );
  });
});
