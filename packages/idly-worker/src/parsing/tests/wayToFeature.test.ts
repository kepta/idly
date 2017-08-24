import { geometry } from '@turf/helpers';
import {
  entityTableGen,
  genLngLat,
  nodeFactory,
  OsmGeometry,
  tagsFactory,
  wayFactory
} from 'idly-common/lib';

import {
  getCoordsFromTable,
  wayCombiner,
  wayToLineString
} from '../../parsing/wayToFeature';

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
      const g = entityTableGen(new Map(), [n1, n2]);
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

    const g = entityTableGen(new Map(), [n1, n2, n3]);
    it('should behave...', () => {
      const result = wayCombiner(way, g);
      expect(result).toMatchSnapshot();
    });

    it('sets up existing props', () => {
      const result = wayCombiner(way, g, {
        geometry: OsmGeometry.LINE,
        k: 'k'
      });
      expect(result.properties).toMatchObject({
        geometry: 'line',
        id: 'w1',
        k: 'k'
      });
    });
    it('throws error if no geometry is provided', () => {
      expect(() => wayCombiner(way, g, { s: 'k' })).toThrow();
    });
  });
});
