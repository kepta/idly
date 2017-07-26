import { Feature, Point } from 'geojson';
import { Map } from 'immutable';

import { nodeFactory } from 'osm/entities/node';

import { featToNode } from 'map/featToNode';
import { nodeToFeat } from 'map/nodeToFeat';

describe('feat to node', () => {
  const n2 = nodeFactory({ id: 'n1', tags: Map({ foo: 'foo' }) });

  it('converts node to feat to node', () => {
    expect(featToNode(nodeToFeat(n2))).toEqual(n2);
  });
});

describe('node to feat', () => {
  const feat: Feature<Point, any> = {
    type: 'Feature',
    properties: {
      node_properties: JSON.stringify({
        visible: true,
        version: '1',
        timestamp: '2013-01-23T13:37:06Z',
        changeset: '14757277',
        uid: '24119',
        user: 'Mauls'
      }),
      tags: JSON.stringify({})
    },
    geometry: { type: 'Point', coordinates: [-0.0326419, 51.4996707] },
    id: 'n2125087175'
  };
  it('converts feat to node to feat', () => {
    expect(nodeToFeat(featToNode(feat))).toEqual(feat);
  });
});
