import { fromJS, Map, Set } from 'immutable';

import { getNodeGeometry, nodeToPoint } from 'map/highPerf/node';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { nodeFactory } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { ParentWays } from 'osm/parsers/parsers';

const n1 = nodeFactory({ id: 'n-1' });
const n11 = nodeFactory({
  id: 'n-1',
  loc: genLngLat({ lon: 15, lat: 10 }),
  tags: tagsFactory({ k: 'k' })
});

describe('converts node to feat', () => {
  describe('nodeToPoint', () => {
    it('should behave...', () => {
      expect(nodeToPoint(n1)).toMatchSnapshot();
      expect(nodeToPoint(n11)).toMatchSnapshot();
    });
  });

  describe('getNodeGeometry', () => {
    it('should work for empty parentWays', () => {
      expect(getNodeGeometry('n1', Map()));
    });
  });
});
