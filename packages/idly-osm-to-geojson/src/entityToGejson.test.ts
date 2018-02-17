import { lngLatFactory } from 'idly-common/lib/geo/lngLatFactory';
import { nodeFactory } from 'idly-common/lib/osm/entityFactory/nodeFactory';
import { tagsFactory } from 'idly-common/lib/osm/entityFactory/tagsFactory';

import { wayFactory } from 'idly-common/lib/osm/entityFactory/wayFactory';
import { Entity, OsmGeometry } from 'idly-common/lib/osm/structures';

import {
  getCoordsFromTable,
  nodeCombiner,
  wayCombiner,
  wayToLineString,
} from './entityToGeojson';

const n1 = nodeFactory({ id: 'n-1' });

const n11 = nodeFactory({
  id: 'n-1',
  loc: lngLatFactory({ lon: 15, lat: 10 }),
  tags: tagsFactory({ k: 'k' }),
});

describe('converts node to feat', () => {
  describe('nodeCombiner', () => {
    it('should behave...', () => {
      expect(nodeCombiner(n1, {})).toMatchSnapshot();
      expect(nodeCombiner(n11, {})).toMatchSnapshot();
    });
    it('should add computed Props', () => {
      expect(nodeCombiner(n1, { test: '1234', h: 3 })).toMatchSnapshot();
    });
  });
});

const way = wayFactory({
  id: 'w1',
  nodes: ['n1'],
  tags: tagsFactory({ highway: 'residential' }),
});

describe('way.test', () => {
  describe('wayToLineString', () => {
    it('should throw error when no geometry provided', () => {
      expect(() => wayToLineString(undefined as any, [[1, 2]])).toThrow(); // ts:disable-line
      expect(() => wayToLineString(OsmGeometry.POINT, [[1, 2]])).toThrow();
    });
    it('should not work when correct coords provided with wrong geometry', () => {
      expect(() =>
        wayToLineString(OsmGeometry.POINT, [[1, 2], [2, 3], [3, 0], [1, 2]])
      ).toThrow();
    });
    it('should throw error when wrong coords provided', () => {
      expect(() =>
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 1]])
      ).toThrow();
    });
    it('should work when correct coords provided', () => {
      expect(() =>
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]])
      ).not.toThrow();
    });
    it('should behave...', () => {
      expect(
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]])
      ).toMatchSnapshot();
    });
  });

  describe('getNodesFromGraph', () => {
    it('should get nodes correctly', () => {
      const node: Entity = nodeFactory({
        id: 'n1',
        loc: lngLatFactory([1, 2]),
      });
      const g = new Map();
      g.set(node.id, {
        entity: node,
      });

      expect(getCoordsFromTable(g, ['n1'])).toMatchSnapshot();
    });

    it('should throw error if nodes not found', () => {
      const node = nodeFactory({ id: 'n1', loc: lngLatFactory([1, 2]) });
      let g = new Map();
      g = g.set(node.id, {
        entity: node,
      });
      expect(() => getCoordsFromTable(g, ['n2'])).toThrow();
    });

    it('should work when multiple nodes are there ingraph', () => {
      const node = nodeFactory({ id: 'n1', loc: lngLatFactory([1, 2]) });
      const n2 = nodeFactory({ id: 'n2', loc: lngLatFactory([3, 4]) });
      const g = new Map();
      g.set(node.id, {
        entity: node,
      });
      g.set(n2.id, {
        entity: n2,
      });
      expect(getCoordsFromTable(g, ['n2'])).toMatchSnapshot();
      expect(getCoordsFromTable(g, ['n1', 'n2'])).toMatchSnapshot();
    });
  });

  describe('wayCombiner', () => {
    const node = nodeFactory({ id: 'n1', loc: lngLatFactory([1, 2]) });
    const n2 = nodeFactory({ id: 'n2', loc: lngLatFactory([3, 4]) });
    const n3 = nodeFactory({ id: 'n3', loc: lngLatFactory([1, 4]) });

    const w1 = wayFactory({
      id: 'w1',
      nodes: ['n1', 'n3'],
      tags: tagsFactory({ highway: 'residential' }),
    });

    const g = new Map();
    [node, n2, n3, w1].forEach(e => {
      g.set(e.id, { entity: e });
    });

    it('should behave...', () => {
      const result = wayCombiner(w1, g, {
        '@idly-geometry': OsmGeometry.LINE,
      });
      expect(result).toMatchSnapshot();
    });

    it('sets up existing props', () => {
      const result = wayCombiner(w1, g, {
        '@idly-geometry': OsmGeometry.LINE,
        'k-k': 'k',
      });
      expect(result.properties).toMatchObject({
        '@idly-geometry': 'line',
        // tslint:disable-next-line:object-literal-key-quotes
        id: 'w1',
        'k-k': 'k',
      });
    });
    it('throws error if no geometry is provided', () => {
      expect(() => wayCombiner(way, g, { s: 'k' } as any)).toThrow();
    });
  });
});
