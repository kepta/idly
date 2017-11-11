// tslint:disable no-expression-statement
import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { Iterable, Set as ImSet } from 'immutable';
import { addNewEntity } from '../actions/tree/addNewEntity';
import { Leaf } from './Leaf';

import { modifyLeaf } from '../actions/tree/modifyLeaf';
import { getPresent } from './getPresent';
import { Tree } from './Tree';

test('simple add new node n', () => {
  const tree = new Tree(undefined, ImSet());
  const n = nodeFactory({ id: 'n' });
  const leaf = Leaf.create(n, undefined);
  const t1 = addNewEntity(tree)(n);
  expect(getPresent(t1)).toEqual(ImSet([leaf]));
});

test('change the node n to n`', () => {
  const cache = new WeakMap();
  const n = nodeFactory({ id: 'n' });
  const leaf = Leaf.create(n, undefined, cache);
  const tree = modifyLeaf(new Tree(undefined, ImSet()))(leaf);

  const newLeaf = leaf.map(entity => {
    return nodeFactory({ id: 'n', tags: { k: 'k' } });
  });

  const newTree = modifyLeaf(tree)(newLeaf);
  expect(newTree.getLeaves()).toEqual(ImSet([newLeaf]));
  expect(newTree.getLeaves()).toEqual(ImSet([newLeaf]));
  expect(newTree.getHidden()).toEqual(ImSet([leaf]));
});
