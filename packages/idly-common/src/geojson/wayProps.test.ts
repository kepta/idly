import { tagsFactory } from '../osm/entityFactory/tagsFactory';
import { wayFactory } from '../osm/entityFactory/wayFactory';
import { wayPropertiesGen } from './wayProps';

describe('wayCombiner', () => {
  const way = wayFactory({
    id: 'w1',
    nodes: ['n1'],
    tags: tagsFactory({ highway: 'residential' }),
  });

  it('should behave...', () => {
    const result = wayPropertiesGen(way);
    expect(result).toMatchSnapshot();
  });

  it('should take name', () => {
    const w2 = wayFactory({
      id: 'w1',
      nodes: ['n1'],
      tags: tagsFactory({ highway: 'residential', name: 'great highway' }),
    });
    const result = wayPropertiesGen(w2);
    expect(result.name).toEqual('great highway');
  });
});
