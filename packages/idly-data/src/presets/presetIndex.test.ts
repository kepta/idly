import { presetIndex } from './presetIndex';
describe('presetIndex', function() {
  describe('#match', function() {
    var testPresets = () => ({
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
    });

    it('returns a collection containing presets matching a geometry and tags', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      var way = { id: 'w-1', tags: { highway: 'residential' } };
      expect(presets.match(way.tags, 'line').id).toEqual('residential');
    });

    it('returns the appropriate fallback preset when no tags match', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      var point = { tags: {} };
      var line = { id: 'w-2', tags: { foo: 'bar' } };
      expect(presets.match(point.tags, 'point').id).toEqual('point');
      expect(presets.match(line.tags, 'line').id).toEqual('line');
    });

    it('matches vertices on a line as vertices', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      var point = { id: 'n-2', tags: { leisure: 'park' } };
      var line = {
        id: 'w-3',
        nodes: [point.id],
        tags: { highway: 'residential' }
      };

      expect(presets.match(point.tags, 'vertex').id).toEqual('vertex');
    });

    it('matches vertices on an addr:interpolation line as points', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      var point = { id: 'n-3', tags: { leisure: 'park' } };

      var line = {
        id: 'w-4',
        nodes: [point.id],
        tags: { 'addr:interpolation': 'even' }
      };

      // NOTE: since addr:interpolation it will be point
      expect(presets.match(point.tags, 'point').id).toEqual('park');
    });
  });

  describe('#areaKeys', function() {
    var testPresets = () => ({
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
    });

    it('whitelists keys for presets with area geometry', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      expect(presets.areaKeys().hasOwnProperty('natural')).toEqual(true);
    });

    it('blacklists key-values for presets with a line geometry', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      var keys = presets.areaKeys().natural;
      expect(presets.areaKeys().natural.hasOwnProperty('tree_row')).toEqual(
        true
      );
      expect(presets.areaKeys().natural.tree_row).toBe(true);
    });

    it('blacklists key-values for presets with both area and line geometry', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      expect(presets.areaKeys().leisure.hasOwnProperty('track')).toEqual(true);
    });

    it('does not blacklist key-values for presets with neither area nor line geometry', function() {
      var presets = presetIndex(undefined, testPresets()).init();

      expect(presets.areaKeys().natural.hasOwnProperty('peak')).toEqual(false);
    });

    it("does not blacklist generic '*' key-values", function() {
      var presets = presetIndex(undefined, testPresets()).init();
      expect(presets.areaKeys().natural.hasOwnProperty('natural')).toEqual(
        false
      );
    });

    it("ignores keys like 'highway' that are assumed to be lines", function() {
      var presets = presetIndex(undefined, testPresets()).init();
      expect(presets.areaKeys().hasOwnProperty('highway')).toEqual(false);
    });

    it('ignores suggestion presets', function() {
      var presets = presetIndex(undefined, testPresets()).init();
      expect(presets.areaKeys().hasOwnProperty('amenity')).toEqual(false);
    });
  });

  describe('expected matches', function() {
    it('prefers building to multipolygon', function() {
      var presets = presetIndex().init();

      var relation = {
        id: 'r-1',
        tags: { type: 'multipolygon', building: 'yes' }
      };
      expect(presets.match(relation.tags, 'area').id).toEqual('building');
    });

    it('prefers building to address', function() {
      var presets = presetIndex().init();

      var way = {
        id: 'w-10',
        tags: { area: 'yes', building: 'yes', 'addr:housenumber': '1234' }
      };

      //   var graph = Graph([way]);
      expect(presets.match(way.tags, 'area').id).toEqual('building');
    });

    it('prefers pedestrian to area', function() {
      var presets = presetIndex().init();
      var way = {
        id: 'w-12',
        tags: { area: 'yes', highway: 'pedestrian' }
      };
      //   var graph = Graph([way]);
      expect(presets.match(way.tags, 'area').id).toEqual(
        'highway/pedestrian_area'
      );
    });
  });
});
