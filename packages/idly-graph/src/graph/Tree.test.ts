import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { Map as ImMap, Set as ImSet } from 'immutable';

import * as entityTableFixture from '../mocks/entityTableFixture.json';
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

describe('Tree.map', () => {
  const entities = Object.keys(entityTableFixture).map(
    r => entityTableFixture[r],
  );
  const fatTree = Tree.fromEntities(entities);
  const { entityTable, parentWays } = fatTree.toObject();
  // ref parentWays
  // n1752475257 Set { "w163579122", "w10324960" }
  // n2018936859 Set { "w51995126" }
  // n1752475389 Set { "w38713751" }
  // n1752475279 Set { "w10324960" }
  // n1752475048 Set { "w38713751" }
  // n4147014459 Set { "w413367879", "w413367881" }
  // n1752475059 Set { "w38713751" }
  // n4146664901 Set { "w5026573", "w413328787" }
  // n4146664912 Set { "w413328796" }
  // n4894520669 Set { "w497956234" }
  // n4146664923 Set { "w413328803" }
  // n3765072580 Set { "w372953900" }
  // n1828813156 Set { "w397440767", "w171923201", "w398335166" }
  // n2425767734 Set { "w234317354", "w234317256", "w234317259" }
  // n2070605081 Set { "w196769292" }
  const knownIds = ImSet([
    'n1752475048',
    'w413367879',
    'n1752475059',
    'w497956234',
    'w171923201',
    'n1828813156',
  ]);
  test('mapping without change, retains the Tree instance', () => {
    const tree = new Tree(knownIds, entityTable);
    expect(
      tree.map(node => {
        return node;
      }),
    ).toBe(tree);
  });
  test('mapping without change, retains the Tree instance', () => {
    const tree = new Tree(knownIds, entityTable);
    expect(
      tree.map(node => {
        return node;
      }),
    ).toBe(tree);
  });
});
