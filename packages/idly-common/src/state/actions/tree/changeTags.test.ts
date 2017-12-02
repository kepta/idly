import { Leaf } from '../../graph/Leaf';
import { Tree } from '../../graph/Tree';
import { createNode } from '../entity/createEntity';
import { changeTags } from './changeTags';

describe('changes the tag', () => {
  test('changes the tags', () => {
    const leaf = Leaf.create(createNode({ id: 'n-a', tags: { k: 'n-a1' } }));
    const tree = Tree.create(leaf);
    const tree1 = changeTags({ k: '1' }, leaf)(tree);
    expect(tree1).toMatchSnapshot();
  });
});
