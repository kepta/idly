import { Map as ImMap } from 'immutable';

import { nodeFactory } from '../osm/nodeFactory';
import { genLngLat } from '../osm/genLngLat';
import { tagsFactory } from '../osm/tagsFactory';

import {
  nodeCombiner,
  wayToLineString,
  getCoordsFromTable,
  wayCombiner,
} from './entityToGeojson';
import { wayFactory } from '../osm/wayFactory';
import { OsmGeometry, Entity, EntityTable } from '../osm/structures';
import { entityTableGen } from '../osm/entityTableGen';

const n1 = nodeFactory({ id: 'n-1' });
const n11 = nodeFactory({
  id: 'n-1',
  loc: genLngLat({ lon: 15, lat: 10 }),
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

const node = nodeFactory({ id: 'n1' });

// tslint:disable:no-expression-statement object-literal-key-quotes
describe('way.test', () => {
  describe('wayToLineString', () => {
    it('should throw error when no geometry provided', () => {
      expect(() => wayToLineString(undefined as any, [[1, 2]])).toThrow(); // ts:disable-line
      expect(() => wayToLineString(OsmGeometry.POINT, [[1, 2]])).toThrow();
    });
    it('should not work when correct coords provided with wrong geometry', () => {
      expect(() =>
        wayToLineString(OsmGeometry.POINT, [[1, 2], [2, 3], [3, 0], [1, 2]]),
      ).toThrow();
    });
    it('should throw error when wrong coords provided', () => {
      expect(() =>
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 1]]),
      ).toThrow();
    });
    it('should work when correct coords provided', () => {
      expect(() =>
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]]),
      ).not.toThrow();
    });
    it('should behave...', () => {
      expect(
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]]),
      ).toMatchSnapshot();
    });
  });

  describe('getNodesFromGraph', () => {
    it('should get nodes correctly', () => {
      const n1: Entity = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      let g: EntityTable = ImMap();
      g = g.set(n1.id, n1);
      expect(getCoordsFromTable(g, ['n1'])).toMatchSnapshot();
    });
    it('should throw error if nodes not found', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      let g: EntityTable = ImMap();
      g = g.set(n1.id, n1);
      expect(() => getCoordsFromTable(g, ['n2'])).toThrow();
    });

    it('should work when multiple nodes are there ingraph', () => {
      const n1 = nodeFactory({ id: 'n1', loc: genLngLat([1, 2]) });
      const n2 = nodeFactory({ id: 'n2', loc: genLngLat([3, 4]) });
      const g = entityTableGen([n1, n2]);
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
      tags: tagsFactory({ highway: 'residential' }),
    });

    const g = entityTableGen([n1, n2, n3, w1]);
    it('should behave...', () => {
      const result = wayCombiner(w1, g, {
        'osm_basic--geometry': OsmGeometry.LINE,
      });
      expect(result).toMatchSnapshot();
    });

    it('sets up existing props', () => {
      const result = wayCombiner(w1, g, {
        k: 'k',
        'osm_basic--geometry': OsmGeometry.LINE,
      });
      expect(result.properties).toMatchObject({
        id: 'w1',
        k: 'k',
        'osm_basic--geometry': 'line',
      });
    });
    it('throws error if no geometry is provided', () => {
      expect(() => wayCombiner(way, g, { s: 'k' } as any)).toThrow();
    });
  });
});
