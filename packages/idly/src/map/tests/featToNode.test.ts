import { Map } from 'immutable';

import { nodeFactory } from 'osm/entities/node';

import { Point } from 'geojson';
import { featToNode } from 'map/utils/featToNode';
import { nodeToFeat } from 'map/utils/nodeToFeat';
import { Feature } from 'typings/geojson';

describe('feat to node', () => {
  const n2 = nodeFactory({ id: 'n1', tags: Map({ foo: 'foo' }) });

  it('converts node to feat to node', () => {
    expect(featToNode(nodeToFeat(n2))).toEqual(n2);
  });
});
interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
  icon: string;
}

describe('node to feat', () => {
  const feat: Feature<Point, INodeProperties> = {
    type: 'Feature',
    properties: {
      id: 'n2125087175',
      node_properties: JSON.stringify({
        visible: true,
        version: '1',
        timestamp: '2013-01-23T13:37:06Z',
        changeset: '14757277',
        uid: '24119',
        user: 'Mauls'
      }),
      icon: 'circle',
      tags: JSON.stringify({})
    },
    geometry: { type: 'Point', coordinates: [-0.0326419, 51.4996707] },
    id: 'n2125087175'
  };
  it('converts feat to node to feat', () => {
    expect(nodeToFeat(featToNode(feat))).toEqual(feat);
  });
});
