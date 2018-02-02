import { Set as ImSet } from 'immutable';

import { lngLatFactory } from '../../../geo/lngLatFactory';
import { EntityType } from '../../../osm/structures';
import { Leaf } from '../../graph/Leaf';
import { Tree } from '../../graph/Tree';
import { createNode, createWay } from '../entity/createEntity';
import { modifyLeaf } from './modifyLeaf';

// tslint:disable:variable-name
describe('modify simple node', () => {
  const leaf_na_1 = Leaf.create(createNode({ id: 'n-a', tags: { k: 'n-a1' } }));
  const leaf_na_2 = leaf_na_1.map(() => {
    return createNode({ id: 'n-a', tags: { k: 'n-a2' } });
  });

  const leaf_na_3 = leaf_na_2.map(() => {
    return createNode({ id: 'n-a', tags: { k: 'n-a3' } });
  });
  const leaf_na_4 = leaf_na_3.map(() => {
    return createNode({
      id: 'n-a',
      loc: lngLatFactory([1, 2]),
      tags: { k: 'n-a4' },
    });
  });

  const leaf_nb_1 = Leaf.create(createNode({ id: 'n-b', tags: { k: 'n-b1' } }));

  const leaf_nc_1 = Leaf.create(createNode({ id: 'n-c', tags: { k: 'n-c1' } }));

  const leaf_nd_1 = Leaf.create(createNode({ id: 'n-d', tags: { k: 'n-d1' } }));

  const leaf_nf_1 = Leaf.create(createNode({ id: 'n-f', tags: { k: 'n-f1' } }));
  const leaf_nf_2 = leaf_nf_1.map(() => {
    return createNode({
      id: 'n-f',
      loc: lngLatFactory([1, 2]),
      tags: { k: 'n-f2' },
    });
  });

  let tree = Tree.create(leaf_na_1);

  const leaf_wa_1 = Leaf.create(
    createWay({
      id: 'w-a',
      nodes: ['n-d', 'n-b', 'n-c'],
    })
  );
  const leaf_wa_2 = leaf_wa_1.map(entity => {
    if (entity.type === EntityType.WAY) {
      return createWay({
        id: 'w-a',
        nodes: ['n-d', 'n-b', 'n-c', 'n-a'],
      });
    }
    return entity;
  });

  const leaf_wa_3 = leaf_wa_2.map(entity => {
    if (entity.type === EntityType.WAY) {
      return createWay({
        id: 'w-a',
        nodes: ['n-d', 'n-b', 'n-a'],
      });
    }
    return entity;
  });

  it('seed tree creation', () => {
    expect(tree).toMatchSnapshot();
  });

  it('add leaf2', () => {
    tree = modifyLeaf(tree)(leaf_na_2);

    expect(tree.getDepth()).toBe(2);
    expect(tree.getBranch()).toEqual(ImSet([leaf_na_2]));
    expect(tree.getOldLeaves()).toEqual(ImSet([leaf_na_1]));
  });

  it('add leaf3', () => {
    tree = modifyLeaf(tree)(leaf_na_3);
    expect(tree.getDepth()).toBe(3);
    expect(tree.getBranch()).toEqual(ImSet([leaf_na_3]));
    expect(tree.getOldLeaves()).toEqual(ImSet([leaf_na_2, leaf_na_1]));
  });

  it('add a diverged leaf', () => {
    // diversion of leaf2
    const leaf_na_3_1 = leaf_na_2.map(() => {
      return createNode({
        id: 'n-a',
        loc: lngLatFactory([1, 2]),
        tags: { k: 'n-a3_1' },
      });
    });
    const treeDiv = modifyLeaf(tree)(leaf_na_3_1);

    expect(treeDiv.getDepth()).toBe(4);
    // Leaf3A2 and Leaf3 diverged with common parent being leaf2
    // to keep things simple show both of these
    expect(treeDiv.getBranch()).toEqual(ImSet([leaf_na_3, leaf_na_3_1]));
  });

  it('add leaf4', () => {
    tree = modifyLeaf(tree)(leaf_na_4);

    expect(tree.getDepth()).toBe(4);
    expect(tree.getBranch()).toEqual(ImSet([leaf_na_4]));
    expect(tree.getOldLeaves()).toEqual(
      ImSet([leaf_na_3, leaf_na_2, leaf_na_1])
    );
  });

  it('check previous tree branches', () => {
    let treeParent = tree.getParent();

    expect(treeParent && treeParent.getBranch()).toEqual(ImSet([leaf_na_3]));

    treeParent = treeParent && treeParent.getParent();

    expect(treeParent && treeParent.getBranch()).toEqual(ImSet([leaf_na_2]));

    treeParent = treeParent && treeParent.getParent();

    expect(treeParent && treeParent.getBranch()).toEqual(ImSet([leaf_na_1]));

    expect(treeParent && treeParent.getParent()).toBeUndefined();
  });

  it('add a new node n-f', () => {
    tree = modifyLeaf(tree)(leaf_nf_1);

    expect(tree.getDepth()).toBe(5);
    expect(tree.getBranch()).toEqual(ImSet([leaf_na_4, leaf_nf_1]));
  });

  it('modify the node n-f', () => {
    tree = modifyLeaf(tree)(leaf_nf_2);
    // console.log(tree.print());
    expect(tree.getDepth()).toBe(6);
    expect(tree.getBranch()).toEqual(ImSet([leaf_na_4, leaf_nf_2]));
  });

  it('add a new way w-a1', () => {
    tree = modifyLeaf(tree)(leaf_wa_1, {
      dependants: [leaf_nd_1, leaf_nb_1, leaf_nc_1],
    });
    expect(tree.getDepth()).toBe(7);

    expect(tree.getBranch().size).toBe(3);

    // newly added 4
    expect(tree.getBranch()).toContain(leaf_wa_1);
  });

  it('w-a1 to w-a2 : should throw when not provided dependants', () => {
    expect(() => modifyLeaf(tree)(leaf_wa_2)).toThrow();
  });

  it('w-a1 to w-a2 : add na_4 to way', () => {
    tree = modifyLeaf(tree)(leaf_wa_2, {
      dependants: [leaf_nd_1, leaf_nb_1, leaf_nc_1, leaf_na_4],
    });

    expect(tree.getDepth()).toBe(8);
    expect(tree.getBranch().size).toBe(3);

    expect(tree.getBranch()).not.toContain(leaf_wa_1);
    expect(tree.getBranch()).toContain(leaf_na_4);
    expect(tree.getBranch()).toContain(leaf_wa_2);
  });

  it('nd_1 to nd_2', () => {
    tree = modifyLeaf(tree)(leaf_nd_1);

    expect(tree.getDepth()).toBe(9);
    expect(tree.getBranch().size).toBe(4);
    expect(tree.getBranch()).toContain(leaf_nd_1);
  });

  it('w-a2 to w-a3 : removes  nc_1', () => {
    tree = modifyLeaf(tree)(leaf_wa_3, {
      dependants: [leaf_nd_1, leaf_nb_1, leaf_na_4],
    });

    expect(tree.getDepth()).toBe(10);
    expect(tree.getBranch().size).toBe(4);

    expect(tree.getBranch()).not.toContain(leaf_wa_1);
    expect(tree.getBranch()).not.toContain(leaf_wa_2);
  });
});
