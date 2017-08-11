import { mount } from 'enzyme';
import { fromJS } from 'immutable';
import * as React from 'react';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

describe('base simpleLayerHOC test', () => {
  it('should  mount', () => {
    const Comp = simpleLayerHOC({
      displayName: 'test',
      layer: null,
      selectable: false
    });
    const wrapper = mount(
      <Comp updateLayer={() => null} entities={null} removeLayer={() => null} />
    );
    expect(wrapper.state('layerSpec')).toEqual(null);
  });
  it('should receive a layer', () => {
    const Comp = simpleLayerHOC({
      displayName: 'test',
      layer: LayerSpec({
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
      }),
      selectable: false
    });
    const wrapper = mount(
      <Comp updateLayer={() => null} entities={null} removeLayer={() => null} />
    );
    expect(wrapper.state('layerSpec')).toEqual(
      LayerSpec({
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
      })
    );
  });
});
