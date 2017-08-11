import { fromJS, Map, Set } from 'immutable';

import { hideEntities } from 'map/utils/hideEntities';
import { LayerFilters, LayerSpec } from 'map/utils/layerFactory';
import { nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { wayFactory } from 'osm/entities/way';

const layer = LayerSpec({
  id: 'test',
  source: 'sourceName',
  type: 'circle',
  layout: {},
  paint: {
    'circle-radius': 6,
    'circle-color': '#eeeeee',
    'circle-stroke-width': 0.5
  },
  filter: fromJS(['all', ['!has', 'icon']])
});

describe('hideEntities', () => {
  const node1 = nodeFactory({ id: 'n1' });
  const node2 = nodeFactory({ id: 'n2' });
  const node3 = nodeFactory({ id: 'n3' });
  const node4 = nodeFactory({ id: 'n4' });

  const way = wayFactory({ id: 'w-1', tags: Map({ foo: 'bar' }) });
  const relation = relationFactory({ id: 'r1' });
  it('should work', () => {
    expect(
      hideEntities(layer, Set([node1, node2]), Set([node3])).get('filter')
    ).toEqual(layer.get('filter'));
  });
  it('should hide entity', () => {
    expect(
      hideEntities(layer, Set([node1, node2]), Set([node2])).get('filter')
    ).toEqual(fromJS(['all', ['!has', 'icon'], ['!in', 'id', 'n1']]));
  });
  it('should not change if already filter exists', () => {
    const filter: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1']
    ]);
    const layer2 = layer.set('filter', filter);
    expect(
      hideEntities(layer2, Set([node1, node2]), Set([node2])).get('filter')
    ).toEqual(filter);
  });
  it('should remove filter if not applicable', () => {
    const filter: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1']
    ]);
    const filterDefault: LayerFilters = fromJS(['all', ['!has', 'icon']]);
    const layer2 = layer.set('filter', filter);
    expect(
      hideEntities(layer2, Set([node2]), Set([node1, node3])).get('filter')
    ).toEqual(filterDefault);
  });
  it('should add more ids to  filter ', () => {
    const filter: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1']
    ]);
    const filterNew: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1', 'n2', 'n3']
    ]);
    const layer2 = layer.set('filter', filter);
    expect(
      hideEntities(layer2, Set([node1, node2, node3]), Set([])).get('filter')
    ).toEqual(filterNew);
  });
  it('it handles duplicate ', () => {
    const filter: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1', 'n1']
    ]);
    const filterNew: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1', 'n2', 'n3']
    ]);
    const layer2 = layer.set('filter', filter);
    expect(
      hideEntities(layer2, Set([node1, node2, node3]), Set([])).get('filter')
    ).toEqual(filterNew);
    expect(
      hideEntities(layer2, Set([node1, node2, node3, node1]), Set([])).get(
        'filter'
      )
    ).toEqual(filterNew);
  });
  it('it clears the filter if the mapboxgl reload is inevitable', () => {
    const filter: LayerFilters = fromJS([
      'all',
      ['!has', 'icon'],
      ['!in', 'id', 'n1', 'n2']
    ]);
    const filterNew: LayerFilters = fromJS(['all', ['!has', 'icon']]);
    const layer2 = layer.set('filter', filter);
    expect(
      hideEntities(layer2, Set([node1, node2]), Set([node3])).get('filter')
    ).toEqual(filterNew);
  });
});
