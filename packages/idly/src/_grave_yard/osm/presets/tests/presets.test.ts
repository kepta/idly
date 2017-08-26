import { List, Map } from 'immutable';
import * as R from 'ramda';

import { getNodeGeometry, getWayGeometry } from 'osm/entities/helpers/misc';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { wayFactory } from 'osm/entities/way';
import { graphFactory } from 'osm/history/graph';
import { initAreaKeys } from 'osm/presets/areaKeys';
import { presetsMatch } from 'osm/presets/match';
import { initPresets } from 'osm/presets/presets';

describe('presetIndex', function() {
  describe('#match', function() {
    const testPresets = {
      presets: {
        point: {
          tags: {},
          geometry: ['point']
        },
        line: {
          tags: {},
          geometry: ['line']
        },
        vertex: {
          tags: {},
          geometry: ['vertex']
        },
        residential: {
          tags: { highway: 'residential' },
          geometry: ['line']
        },
        park: {
          tags: { leisure: 'park' },
          geometry: ['point', 'area']
        }
      }
    };

    const { all, defaults, index, recent } = initPresets(testPresets);
    const areaKeys = initAreaKeys(all);
    const curriedPresetsMatch = R.curry(presetsMatch)(all, index, areaKeys);
    it('returns a collection containing presets matching a geometry and tags', function() {
      const presets = initPresets(testPresets);
      const way = wayFactory({
        id: 'w-1',
        tags: tagsFactory({ highway: 'residential' })
      });

      const graph = graphFactory([way]);

      expect(curriedPresetsMatch(getWayGeometry(way), way.tags).id).toEqual(
        'residential'
      );
    });
    it('returns the appropriate fallback preset when no tags match', function() {
      const point = nodeFactory({ id: 'n1' });
      const line = wayFactory({
        id: 'w-1',
        tags: tagsFactory({ foo: 'bar' })
      });
      const graph = graphFactory([point, line]);

      expect(
        curriedPresetsMatch(getNodeGeometry(point, Map()), point.tags).id
      ).toEqual('point');
      expect(curriedPresetsMatch(getWayGeometry(line), line.tags).id).toEqual(
        'line'
      );
    });

    it.skip('matches vertices on a line as vertices', function() {
      const point = nodeFactory({
        id: 'n1',
        tags: tagsFactory({ leisure: 'park' })
      });
      const way = wayFactory({
        id: 'w-1',
        nodes: List(['n1']),
        tags: tagsFactory({ highway: 'residential' })
      });

      expect(
        curriedPresetsMatch(getNodeGeometry(point, Map()), point.tags).id
      ).toEqual('vertex');
    });
    /**
     * @REVISIT when isOnAddressLine is implemented.
     */
    it.skip(
      'matches vertices on an addr:interpolation line as points',
      function() {
        const presets = initPresets(testPresets);

        const point = nodeFactory({
          id: 'n-1',
          tags: tagsFactory({ leisure: 'park' })
        });
        const line = wayFactory({
          nodes: List([point.id]),
          id: 'w-1',
          tags: tagsFactory({ 'addr:interpolation': 'even' })
        });

        expect(
          curriedPresetsMatch(getNodeGeometry(point, Map()), point.tags).id
        ).toEqual('park');
      }
    );
  });

  describe('#areaKeys', function() {
    const testPresets = {
      presets: {
        'amenity/fuel/shell': {
          tags: { amenity: 'fuel' },
          geometry: ['point', 'area'],
          suggestion: true
        },
        'highway/foo': {
          tags: { highway: 'foo' },
          geometry: ['area']
        },
        'leisure/track': {
          tags: { leisure: 'track' },
          geometry: ['line', 'area']
        },
        natural: {
          tags: { natural: '*' },
          geometry: ['point', 'vertex', 'area']
        },
        'natural/peak': {
          tags: { natural: 'peak' },
          geometry: ['point', 'vertex']
        },
        'natural/tree_row': {
          tags: { natural: 'tree_row' },
          geometry: ['line']
        },
        'natural/wood': {
          tags: { natural: 'wood' },
          geometry: ['point', 'area']
        }
      }
    };

    it('whitelists keys for presets with area geometry', function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).has('natural')).toEqual(true);
    });

    it('blacklists key-values for presets with a line geometry', function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).has('natural')).toEqual(true);
      expect(initAreaKeys(all).getIn(['natural', 'tree_row'])).toEqual(true);
    });

    it('blacklists key-values for presets with both area and line geometry', function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).has('natural')).toEqual(true);
      expect(initAreaKeys(all).get('leisure').has('track')).toEqual(true);
    });

    it('does not blacklist key-values for presets with neither area nor line geometry', function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).has('natural')).toEqual(true);
      expect(initAreaKeys(all).get('natural').has('peak')).toEqual(false);
    });

    it("does not blacklist generic '*' key-values", function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).get('natural').has('natural')).toEqual(false);
    });

    it("ignores keys like 'highway' that are assumed to be lines", function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).has('highway')).toEqual(false);
    });

    it('ignores suggestion presets', function() {
      const { all } = initPresets(testPresets);
      expect(initAreaKeys(all).has('amenity')).toEqual(false);
    });
  });

  describe('expected matches', function() {
    const { all, defaults, index, recent } = initPresets();
    const areaKeys = initAreaKeys(all);
    const curriedPresetsMatch = R.curry(presetsMatch)(all, index, areaKeys);
    it('prefers building to multipolygon', function() {
      const relation = relationFactory({
        id: 'r-1',
        tags: tagsFactory({ type: 'multipolygon', building: 'yes' })
      });
      expect(curriedPresetsMatch(relation.geometry, relation.tags).id).toEqual(
        'building'
      );
    });

    it('prefers building to address', function() {
      const way = wayFactory({
        id: 'w-1',
        tags: tagsFactory({
          area: 'yes',
          building: 'yes',
          'addr:housenumber': '1234'
        })
      });
      expect(curriedPresetsMatch(getWayGeometry(way), way.tags).id).toEqual(
        'building'
      );
    });

    it('prefers pedestrian to area', function() {
      const way = wayFactory({
        id: 'w-1',
        tags: tagsFactory({ area: 'yes', highway: 'pedestrian' })
      });
      expect(curriedPresetsMatch(getWayGeometry(way), way.tags).id).toEqual(
        'highway/pedestrian'
      );
    });
  });
});
