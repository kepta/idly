import {
  entityTableGen,
  genLngLat,
  nodeFactory,
  tagsFactory,
  wayFactory
} from 'idly-common/lib';
import { dummyParentWaysGen } from './helpers/dummyParentWaysGen';

import { IdlyOSM } from './index';

describe('test IdlyOSM', () => {
  describe('onParseEntities', () => {
    const n1 = nodeFactory({
      id: 'n1',
      loc: genLngLat({ lon: 15, lat: 10 }),
      tags: tagsFactory({ k: 'k' })
    });
    const n2 = nodeFactory({
      id: 'n2',
      loc: genLngLat({ lon: 5, lat: 12 }),
      tags: tagsFactory({ k: 'k' })
    });
    const n3 = nodeFactory({
      id: 'n3',
      loc: genLngLat({ lon: 15, lat: 10 }),
      tags: tagsFactory({ k: 'k' })
    });
    const n4 = nodeFactory({
      id: 'n4',
      loc: genLngLat({ lon: 0, lat: 10 }),
      tags: tagsFactory({ k: 'k' })
    });

    const w1 = wayFactory({
      id: 'w1',
      nodes: ['n1', 'n2', 'n4'],
      tags: tagsFactory({ highway: 'residential' })
    });

    const w2 = wayFactory({
      id: 'w2',
      nodes: ['n1', 'n3'],
      tags: tagsFactory({ highway: 'residential' })
    });
    var table = entityTableGen(new Map(), [n1, n2, n3, n4, w1, w2]);
    var parentWays = dummyParentWaysGen({
      n1: new Set(['w1', 'w2']),
      n2: new Set(['w1']),
      n3: new Set(['w2']),
      n4: new Set(['w1'])
    });
    it('should behave...', () => {
      var mainClass = new IdlyOSM();
      var propsAdded = mainClass.onParseEntities(table, parentWays);
      expect(propsAdded).toMatchSnapshot();
    });
  });
});
