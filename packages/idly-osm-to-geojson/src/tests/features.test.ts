import { lngLatFactory } from 'idly-common/lib/geo/lngLatFactory';
import { nodeFactory } from 'idly-common/lib/osm/entityFactory/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/entityFactory/relationFactory';
import { tagsFactory } from 'idly-common/lib/osm/entityFactory/tagsFactory';

import { wayFactory } from 'idly-common/lib/osm/entityFactory/wayFactory';
import {
  Node,
  OsmGeometry,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { nodeFeatures } from '../nodeFeatures';
import { Derived, DerivedTable } from '../types';
import {
  getCoordsFromTable,
  wayFeatures,
  wayToLineString,
} from '../wayFeatures';

describe('converts node to feat', () => {
  const n1: Derived<Node> = {
    entity: nodeFactory({ id: 'n1' }),
    parentRelations: new Set(),
    parentWays: new Set(['w1']),
  };

  const n11 = {
    entity: nodeFactory({
      id: 'n1#0',
      loc: lngLatFactory({ lon: 15, lat: 10 }),
      tags: tagsFactory({ k: 'k' }),
    }),
    parentRelations: new Set(),
    parentWays: new Set(),
  };
  it('should behave...', () => {
    expect(nodeFeatures(n1).properties).toMatchObject({
      '@idly-geometry': OsmGeometry.VERTEX,
    });

    expect(nodeFeatures(n11).properties).toMatchObject({
      '@idly-geometry': OsmGeometry.POINT,
    });

    expect(nodeFeatures(n1)).toMatchSnapshot();
    expect(nodeFeatures(n11)).toMatchSnapshot();
  });
});

describe('way.test', () => {
  describe('wayToLineString', () => {
    it('should throw error when no geometry provided', () => {
      expect(() => wayToLineString(undefined as any, [[1, 2]], {})).toThrow(); // ts:disable-line
      expect(() => wayToLineString(OsmGeometry.POINT, [[1, 2]], {})).toThrow();
    });

    it('should not work when correct coords provided with wrong geometry', () => {
      expect(() =>
        wayToLineString(OsmGeometry.POINT, [[1, 2], [2, 3], [3, 0], [1, 2]], {})
      ).toThrow();
    });
    it('should throw error when wrong coords provided', () => {
      expect(() =>
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 1]], {})
      ).toThrow();
    });
    it('should work when correct coords provided', () => {
      expect(() =>
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]], {})
      ).not.toThrow();
    });
    it('should behave...', () => {
      expect(
        wayToLineString(OsmGeometry.AREA, [[1, 2], [2, 3], [3, 0], [1, 2]], {})
      ).toMatchSnapshot();
    });
  });

  describe('get Nodes', () => {
    it('should get nodes correctly', () => {
      const node: Derived<Node> = {
        entity: nodeFactory({ id: 'n1', loc: lngLatFactory([1, 2]) }),
        parentRelations: new Set(),
        parentWays: new Set(['w1']),
      };

      const g: DerivedTable = new Map();

      g.set(node.entity.id, node);

      expect(getCoordsFromTable(g, ['n1'])).toEqual([[1, 2]]);
    });

    it('should throw error if nodes not found', () => {
      const g: DerivedTable = new Map();

      expect(() => getCoordsFromTable(g, ['n2'])).toThrow();
    });

    it('should work when multiple nodes are there in graph', () => {
      const node1: Derived<Node> = {
        entity: nodeFactory({ id: 'n1', loc: lngLatFactory([1, 2]) }),
        parentRelations: new Set(),
        parentWays: new Set(['w1']),
      };

      const node2: Derived<Node> = {
        entity: nodeFactory({ id: 'n2', loc: lngLatFactory([1, 4]) }),
        parentRelations: new Set(),
        parentWays: new Set([]),
      };

      const g = new Map();
      g.set(node1.entity.id, node1);
      g.set(node2.entity.id, node2);

      expect(getCoordsFromTable(g, ['n2'])).toEqual([[1, 4]]);
      expect(getCoordsFromTable(g, ['n1', 'n2'])).toEqual([[1, 2], [1, 4]]);
    });
  });

  describe('wayFeatures', () => {
    const n1: Derived<Node> = {
      entity: nodeFactory({ id: 'n1', loc: lngLatFactory([1, 2]) }),
      parentRelations: new Set(),
      parentWays: new Set(['w1']),
    };
    const n2: Derived<Node> = {
      entity: nodeFactory({ id: 'n2', loc: lngLatFactory([3, 4]) }),
      parentRelations: new Set(),
      parentWays: new Set(['w1']),
    };

    const n3: Derived<Node> = {
      entity: nodeFactory({ id: 'n3', loc: lngLatFactory([1, 4]) }),
      parentRelations: new Set(['r1']),
      parentWays: new Set([]),
    };

    const w1: Derived<Way> = {
      entity: wayFactory({
        id: 'w1',
        nodes: ['n1', 'n2'],
        tags: tagsFactory({ highway: 'residential' }),
      }),
      parentRelations: new Set(),
      parentWays: new Set(),
    };

    const r1: Derived<Relation> = {
      entity: relationFactory({
        id: 'r1',
        members: [{ id: 'n1', ref: 'n1' }, { id: 'n2', ref: 'n2' }],
        tags: {},
      }),
      parentRelations: new Set(),
      parentWays: new Set(),
    };

    const g: DerivedTable = new Map();

    [n1, n2, n3, w1, r1].forEach(e => {
      g.set(e.entity.id, e);
    });

    it('should behave...', () => {
      const result = wayFeatures(w1, g);
      expect(result).toMatchSnapshot();
    });

    it('sets up existing props', () => {
      const result = wayFeatures(w1, g);
      expect(result.properties).toMatchObject({
        '@idly-geometry': 'line',
        id: 'w1',
      });
    });
  });
});
