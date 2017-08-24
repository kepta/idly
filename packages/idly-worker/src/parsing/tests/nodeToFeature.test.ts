import { genLngLat, nodeFactory, tagsFactory } from 'idly-common/lib';

import { nodeCombiner } from '../../parsing/nodeToFeature';

const n1 = nodeFactory({ id: 'n-1' });
const n11 = nodeFactory({
  id: 'n-1',
  loc: genLngLat({ lon: 15, lat: 10 }),
  tags: tagsFactory({ k: 'k' })
});

describe('converts node to feat', () => {
  describe('nodeCombiner', () => {
    it('should behave...', () => {
      expect(nodeCombiner(n1, {})).toMatchSnapshot();
      expect(nodeCombiner(n11, {})).toMatchSnapshot();
    });
    it('should add computed Props', () => {
      expect(nodeCombiner(n1, { test: '1234', h: 3 })).toMatchSnapshot();
    });
  });
});
