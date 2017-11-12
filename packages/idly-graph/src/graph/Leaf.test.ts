// tslint:disable no-expression-statement

import { Set as ImSet } from 'immutable';

import { nodeFactory } from '../../../idly-common/lib/osm/nodeFactory';
import { wayFactory } from '../../../idly-common/lib/osm/wayFactory';
import { Leaf } from './Leaf';

describe('map', () => {
  test('maintains the same instance', () => {
    const e = nodeFactory({ id: 'n1' });
    const l1 = Leaf.create(e);
    const l2 = l1.map(entity => entity);
    expect(l1).toBe(l2);
    // using module cache
    const l3 = Leaf.create(e);
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
    expect(l1.getEntity()).not.toEqual(l2.getEntity());
  });
});

describe('ancestors', () => {
  const e = nodeFactory({ id: 'n1' });
  const l1 = Leaf.create(e);

  const l2 = l1.map(entity => {
    return nodeFactory({ id: 'n1', tags: { K: 'K' } });
  });

  const l3 = l2.map(entity => {
    return nodeFactory({ id: 'n1', tags: { K: 'K', T: 'T' } });
  });

  test('getAncestor', () => {
    expect(l1.getAncestor()).toBeUndefined();
    expect(l2.getAncestor()).toBe(l1);
    expect(l3.getAncestor()).toBe(l2);
  });

  test('getAllAncestors', () => {
    expect(l2.getAllAncestors()).toEqual(ImSet([l1]));
    expect(l3.getAllAncestors()).toEqual(ImSet([l2, l1]));
  });
});

describe('dependencies', () => {
  const e = wayFactory({ id: 'n1', nodes: ['n1', 'n2'] });
  const l1 = Leaf.create(e);
  test('dep', () => {
    expect(l1.getDependencies()).toEqual(e.nodes);
  });
});

describe('isFirstGeneration', () => {
  const e = wayFactory({ id: 'n1', nodes: ['n1', 'n2'] });
  const l1 = Leaf.create(e);
  test('is first', () => {
    expect(l1.isFirstGeneration()).toEqual(true);
  });
});
