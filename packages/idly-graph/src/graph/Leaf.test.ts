// tslint:disable no-expression-statement

import { nodeFactory } from '../../../idly-common/lib/osm/nodeFactory';
import { Leaf } from './Leaf';
describe('map', () => {
  test('maintains the same instance', () => {
    const cache = new WeakMap();
    const e = nodeFactory({ id: 'n1' });
    const l1 = Leaf.create(e, undefined, cache);
    const l2 = l1.map(entity => entity, cache);
    expect(l1).toBe(l2);
    // using module cache
    const l3 = Leaf.create(e, undefined);
    const l4 = l3.map(entity => entity);
    expect(l3).toBe(l4);
  });

  test('different instance', () => {
    const e = nodeFactory({ id: 'n1' });
    const l1 = Leaf.create(e);
    const l2 = l1.map(entity => {
      return nodeFactory({ id: 'n1', tags: { K: 'K' } });
    });
    expect(l2.getAncestor()).toBe(l1);
    expect(l1.entity).not.toEqual(l2.entity);
  });
});
