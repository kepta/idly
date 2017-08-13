import { List } from 'immutable';

import { tagsFactory } from 'osm/entities/helpers/tags';
import { nodeFactory } from 'osm/entities/node';
import { wayFactory } from 'osm/entities/way';
import { graphFactory } from 'osm/history/graph';

import {
  getCoordsFromGraph,
  wayCombiner,
  wayToLineString
} from 'map/highPerf/way';
import { Geometry } from 'osm/entities/constants';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { getWayGeometry } from 'osm/parsers/parsers';
import { wayToFeat } from 'map/utils/wayToFeat';

const way = wayFactory({
  id: 'w1',
  nodes: List(['n1']),
  tags: tagsFactory({ highway: 'residential' })
});

const node = nodeFactory({ id: 'n1' });

const graph = graphFactory([node, way]);

describe('way.test', () => {
  describe('wayToLineString', () => {
    it('should throw error when no geometry provided', () => {
      expect(() => wayToLineString(null, [[1, 2]])).toThrow();
      expect(() => wayToLineString(Geometry.POINT, [[1, 2]])).toThrow();
    });
    it('should not work when correct coords provided with wrong geometry', () => {
      expect(() =>
        wayToLineString(Geometry.POINT, [[1, 2], [2, 3], [3, 0], [1, 2]])
      ).toThrow();
    });
    it('should throw error when wrong coords provided', () => {
      expect(() => wayToLineString(Geometry.AREA, [[1, 2], [2, 1]])).toThrow();
    });
    it('should work when correct coords provided', () => {
      expect(() =>
        wayToLineString(Geometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]])
      ).not.toThrow();
    });
    it('should behave...', () => {
      expect(
        wayToLineString(Geometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]])
      ).toMatchSnapshot();
    });
  });

  describe('getNodesFromGraph', () => {
    it('should get nodes correctly', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      const g = graphFactory([n1]);
      expect(getCoordsFromGraph(g.node, List(['n1']))).toMatchSnapshot();
    });
    it('should throw error if nodes not found', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      const g = graphFactory([n1]);
      expect(() => getCoordsFromGraph(g.node, List(['n2']))).toThrow();
    });

    it('should work when multiple nodes are there ingraph', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      const n2 = nodeFactory({ id: 'n2', loc: genLngLat([3, 4]) });
      const g = graphFactory([n1, n2]);
      expect(getCoordsFromGraph(g.node, List(['n2']))).toMatchSnapshot();
      expect(getCoordsFromGraph(g.node, List(['n1', 'n2']))).toMatchSnapshot();
    });
  });

  describe('wayCombiner', () => {
    const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
    const n2 = nodeFactory({ id: 'n2', loc: genLngLat([3, 4]) });
    const n3 = nodeFactory({ id: 'n3', loc: genLngLat([1, 4]) });

    const w1 = wayFactory({
      id: 'w1',
      nodes: List(['n1', 'n3']),
      tags: tagsFactory({ highway: 'residential' })
    });

    const g = graphFactory([n1, n2, n3]);
    it('should behave...', () => {
      const result = wayCombiner(way, graph);
      expect(result).toMatchSnapshot();
      const result2 = wayCombiner(w1, g);
      expect(result2).toMatchSnapshot();
    });

    it('should take name', () => {
      const w2 = wayFactory({
        id: 'w1',
        nodes: List(['n1']),
        tags: tagsFactory({ highway: 'residential', name: 'great highway' })
      });
      const g2 = graphFactory([node, w2]);
      const result = wayCombiner(w2, g2);
      expect(result.properties.name).toEqual('great highway');
    });
  });
});
