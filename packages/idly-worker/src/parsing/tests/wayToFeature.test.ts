// import { List } from 'immutable';

// import { tagsFactory } from 'osm/entities/helpers/tags';
// import { nodeFactory } from 'osm/entities/node';
// import { wayFactory } from 'osm/entities/way';
// import { graphFactory } from 'osm/history/graph';

// import {
//   getCoordsFromGraph,
//   wayCombiner,
//   wayToLineString
// } from 'map/highPerf/way';
// import { Geometry } from 'osm/entities/constants';
// import { genLngLat } from 'osm/geo_utils/lng_lat';
import { tagsFactory } from 'helpers/tagsFactory';
import {
  applyNodeMarkup,
  DEFAULT_NODE_ICON,
  nodeCombiner,
  nodeToPoint
} from 'parsing/nodeToFeature';
import { ParentWays } from 'parsing/parser';
import {
  getCoordsFromTable,
  wayCombiner,
  wayToLineString
} from 'parsing/wayToFeature';
import { Geometry } from 'structs/geometry';
import { genLngLat } from 'structs/lngLat';
import { nodeFactory } from 'structs/node';
import { addEntitiesTable } from 'structs/table';
import { wayFactory } from 'structs/way';

const way = wayFactory({
  id: 'w1',
  nodes: ['n1'],
  tags: tagsFactory({ highway: 'residential' })
});

const node = nodeFactory({ id: 'n1' });

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
      const g = new Map();
      g.set(n1.id, n1);
      expect(getCoordsFromTable(g, ['n1'])).toMatchSnapshot();
    });
    it('should throw error if nodes not found', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      const g = new Map();
      g.set(n1.id, n1);
      expect(() => getCoordsFromTable(g, ['n2'])).toThrow();
    });

    it('should work when multiple nodes are there ingraph', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      const n2 = nodeFactory({ id: 'n2', loc: genLngLat([3, 4]) });
      const g = addEntitiesTable(new Map(), [n1, n2]);
      expect(getCoordsFromTable(g, ['n2'])).toMatchSnapshot();
      expect(getCoordsFromTable(g, ['n1', 'n2'])).toMatchSnapshot();
    });
  });

  describe('wayCombiner', () => {
    const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
    const n2 = nodeFactory({ id: 'n2', loc: genLngLat([3, 4]) });
    const n3 = nodeFactory({ id: 'n3', loc: genLngLat([1, 4]) });

    const w1 = wayFactory({
      id: 'w1',
      nodes: ['n1', 'n3'],
      tags: tagsFactory({ highway: 'residential' })
    });

    const g = addEntitiesTable(new Map(), [n1, n2, n3]);
    it('should behave...', () => {
      const result = wayCombiner(way, g);
      expect(result).toMatchSnapshot();
    });

    it('should take name', () => {
      const w2 = wayFactory({
        id: 'w1',
        nodes: ['n1'],
        tags: tagsFactory({ highway: 'residential', name: 'great highway' })
      });
      const gg = addEntitiesTable(new Map(), [node, w2]);
      const result = wayCombiner(w2, gg);
      expect(result.properties.name).toEqual('great highway');
    });
  });
});
