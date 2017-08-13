import { fromJS, Map, Set } from 'immutable';

import {
  applyNodeMarkup,
  DEFAULT_NODE_ICON,
  getNodeGeometry,
  nodeCombiner,
  nodeToPoint
} from 'map/highPerf/node';
import { nodeToFeat } from 'map/utils/nodeToFeat';
import { Geometry } from 'osm/entities/constants';
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
const parentWays: ParentWays = Map({
  n3780767744: Set<string>(['w40542208']),
  n4558992269: Set<string>(['w40542208']),
  n253179996: Set<string>([
    'w40882200',
    'w237684574',
    'w173431854',
    'w450548831'
  ]),
  n1485636774: Set<string>(['w40882200', 'w135262258'])
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
      expect(getNodeGeometry('n1', Map())).toEqual(Geometry.POINT);
    });
    it('should work for not matching parentWays', () => {
      expect(getNodeGeometry('n1', parentWays)).toEqual(Geometry.POINT);
    });
    it('should give vertex when inside a way', () => {
      expect(getNodeGeometry('n3780767744', parentWays)).toEqual(
        Geometry.VERTEX
      );
    });
    it('should give VERTEX_SHARED when shared between vertices', () => {
      expect(getNodeGeometry('n253179996', parentWays)).toEqual(
        Geometry.VERTEX_SHARED
      );
    });
  });

  describe('applyNodeMarkup', () => {
    it('should work', () => {
      const markup = applyNodeMarkup(Geometry.POINT, tagsFactory({ k: 'k' }));
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: undefined,
        geometry: Geometry.POINT
      });
    });
    it('should get the icon', () => {
      const markup = applyNodeMarkup(Geometry.POINT, tagsFactory({ k: 'k' }));
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: undefined,
        geometry: Geometry.POINT
      });
    });
    it('should get the name', () => {
      const markup = applyNodeMarkup(
        Geometry.POINT,
        tagsFactory({ name: 'whatsInTheName' })
      );
      expect(markup).toEqual({
        icon: DEFAULT_NODE_ICON,
        name: 'whatsInTheName',
        geometry: Geometry.POINT
      });
    });
  });

  describe('nodeCombiner', () => {
    it('should work', () => {
      const result = nodeCombiner(n11, parentWays);
      expect(result).toMatchSnapshot();
    });
  });
});
