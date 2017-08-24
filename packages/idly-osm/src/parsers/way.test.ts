import {
  entityTableGen,
  genLngLat,
  nodeFactory,
  tagsFactory,
  wayFactory
} from 'idly-common/lib';

import { wayPropertiesGen } from '../parsers/way';

describe('wayCombiner', () => {
  const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
  const n2 = nodeFactory({ id: 'n2', loc: genLngLat([3, 4]) });
  const n3 = nodeFactory({ id: 'n3', loc: genLngLat([1, 4]) });
  const node = nodeFactory({ id: 'n1' });
  const way = wayFactory({
    id: 'w1',
    nodes: ['n1'],
    tags: tagsFactory({ highway: 'residential' })
  });

  const g = entityTableGen(new Map(), [n1, n2, n3]);
  it('should behave...', () => {
    const result = wayPropertiesGen(way, g);
    expect(result).toMatchSnapshot();
  });

  it('should take name', () => {
    const w2 = wayFactory({
      id: 'w1',
      nodes: ['n1'],
      tags: tagsFactory({ highway: 'residential', name: 'great highway' })
    });
    const gg = entityTableGen(new Map(), [node, w2]);
    const result = wayPropertiesGen(w2, gg);
    expect(result.name).toEqual('great highway');
  });
});
