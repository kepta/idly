import { createNode, createWay } from '../actions/entity/createEntity';

import { Leaf } from './Leaf';
import { Way } from '../../osm/structures';
import { genLngLat } from '../../osm/genLngLat';

describe('map', () => {
  test('maintains the same instance', () => {
    const e = createNode({ id: 'n1' });
    const l1 = Leaf.create(e);
    const l2 = l1.map(entity => entity);
    expect(l1).toBe(l2);

    const l3 = Leaf.create(e);
    const l4 = l3.map(entity => entity);
    expect(l3).toBe(l4);
    expect(l3).toBe(l1);
  });

  test('different instance', () => {
    const e = createNode({ id: 'n1' });
    const l1 = Leaf.create(e);
    const l2 = l1.map(entity => {
      return createNode({ id: 'n1', tags: { K: 'K' } });
    });
    expect(l2.getAncestor()).toBe(l1);
    expect(l1.getEntity()).not.toEqual(l2.getEntity());
  });
  test('divergence of leaf', () => {
    const e = createNode({ id: 'n1' });
    const l1 = Leaf.create(e);
    const l2 = l1.map(entity => {
      return createNode({ id: 'n1', tags: { K: 'K' } });
    });

    expect(l2).toBe(l2);
  });

  test('old ancestor become new ancestor', () => {
    // this test is important as it tells the ancestors
    // can be reduced, ancestors are minimum steps needed to
    // make the entity
    const n1 = createNode({ id: 'n1' });
    const n2 = createNode({ id: 'n1', tags: { K: '2' } });
    const n3 = createNode({ id: 'n1', tags: { K: '3' } });
    const l1 = Leaf.create(n1);

    const l2 = l1.map(entity => {
      return n2;
    });
    const l3 = l2.map(entity => {
      return n3;
    });
    expect(l3.map(entity => n1)).toBe(l1);
  });

  test('be able to return partial entity', () => {
    const l1 = Leaf.create(createNode({ id: 'n1' }));
    const l2 = l1.map(entity => {
      return { ...entity, tags: { k: 'k', a: 'a' } };
    });
    expect(l2).toBe(
      Leaf.create(createNode({ id: 'n1', tags: { k: 'k', a: 'a' } })),
    );
    const l3 = Leaf.create(createWay({ id: 'w1' }));
    const l4 = l3.map(entity => {
      return { ...entity, nodes: ['n1', 'n2'] };
    });
    expect((l4.getEntity() as Way).nodes).toEqual(['n1', 'n2']);
  });

  test('be able to ignore not found properties ', () => {
    const l3 = Leaf.create(createNode({ id: 'w1' }));
    const l4 = l3.map(entity => {
      return { ...entity, nodes: ['n1'] };
    });
    expect(l4).toBe(l3);
    const l5 = l4.map(entity => {
      return { ...entity, garbage: ['n1'], tags: { k: 'k' } };
    });

    expect(l5).toBe(
      l3.map(entity => ({
        ...entity,
        tags: {
          k: 'k',
        },
      })),
    );
  });
});

describe('ancestors', () => {
  const e = createNode({ id: 'n1' });
  const l1 = Leaf.create(e);

  const l2 = l1.map(entity => {
    return createNode({ id: 'n1', tags: { K: 'K' } });
  });

  const l3 = l2.map(entity => {
    return createNode({ id: 'n1', tags: { K: 'K', T: 'T' } });
  });

  test('getAncestor', () => {
    expect(l1.getAncestor()).toBeUndefined();
    expect(l2.getAncestor()).toBe(l1);
    expect(l3.getAncestor()).toBe(l2);
  });

  test('getAllAncestors', () => {
    expect(l2.getAllAncestors()).toEqual([l1]);
    expect(l3.getAllAncestors()).toEqual([l2, l1]);
  });
});

describe('dependencies', () => {
  const e = createWay({ id: 'n1', nodes: ['n1', 'n2'] });
  const l1 = Leaf.create(e);
  test('dep', () => {
    expect(l1.getDependencies()).toEqual(e.nodes);
  });
});

describe('isFirstGeneration', () => {
  const e = createWay({ type: 'way', id: 'n1', nodes: ['n1', 'n2'] });
  const l1 = Leaf.create(e);
  test('is first', () => {
    expect(l1.isFirstGeneration()).toEqual(true);
  });
});

describe('stringifying', () => {
  const e = createNode({ id: 'n1' });
  const l1 = Leaf.create(e);
  test('simple stringify', () => {
    expect(l1.toString()).toMatchSnapshot();
    expect(JSON.parse(l1.toString())).toMatchSnapshot();
    expect(JSON.parse(l1.toString()).map(JSON.parse)).toMatchSnapshot();
  });

  const leaf1 = Leaf.create(createNode({ id: 'n-a', tags: { k: 'n-a1' } }));
  const leaf2 = leaf1.map(entity => {
    return createNode({ id: 'n-a', tags: { k: 'n-a2' } });
  });

  const leaf3 = leaf2.map(entity => {
    return createNode({ id: 'n-a', tags: { k: 'n-a3' } });
  });
  const leaf4 = leaf3.map(entity => {
    return createNode({
      id: 'n-a',
      loc: genLngLat([1, 2]),
      tags: { k: 'n-a4' },
      type: 'node',
    });
  });
  test('3 parents', () => {
    expect(leaf4.toString()).toMatchSnapshot();
    expect(JSON.parse(leaf4.toString())).toMatchSnapshot();
    expect(JSON.parse(leaf4.toString()).map(JSON.parse)).toMatchSnapshot();

    const newLeaf4 = Leaf.fromString(leaf4.toString()) as Leaf;
    expect(newLeaf4).toEqual(leaf4);
    expect(newLeaf4).toBe(leaf4);

    expect(newLeaf4.getAncestor()).toEqual(leaf3);
    expect((newLeaf4.getAncestor() as Leaf).getAncestor()).toEqual(leaf2);
    expect(
      ((newLeaf4.getAncestor() as Leaf).getAncestor() as Leaf).getAncestor(),
    ).toEqual(leaf1);
  });
});
