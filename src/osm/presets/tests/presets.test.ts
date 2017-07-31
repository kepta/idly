import { List } from 'immutable';

import { nodeFactory } from 'osm/entities/node';
import { wayFactory } from 'osm/entities/way';
import { graphFactory } from 'osm/history/graph';
import { tagsFactory } from 'osm/others/tags';
import { initPresets, presetsMatch } from 'osm/presets/presets';

describe('iD.presetIndex', function() {
  let savedPresets;

  //   before(function() {
  //     savedPresets = iD.data.presets;
  //   });

  //   after(function() {
  //     iD.data.presets = savedPresets;
  //   });

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

    it('returns a collection containing presets matching a geometry and tags', function() {
      const presets = initPresets(testPresets);
      const way = wayFactory({
        id: 'w-1',
        tags: tagsFactory({ highway: 'residential' })
      });

      const graph = graphFactory([way]);

      expect(presetsMatch(way).id).toEqual('residential');
    });
    it('returns the appropriate fallback preset when no tags match', function() {
      const presets = initPresets(testPresets);

      const point = nodeFactory({ id: 'n1' });
      const line = wayFactory({
        id: 'w-1',
        tags: tagsFactory({ foo: 'bar' })
      });
      const graph = graphFactory([point, line]);

      expect(presetsMatch(point).id).toEqual('point');
      expect(presetsMatch(line).id).toEqual('line');
    });

    it.skip('matches vertices on a line as vertices', function() {
      const presets = initPresets(testPresets);
      const point = nodeFactory({
        id: 'n1',
        tags: tagsFactory({ leisure: 'park' })
      });

      const way = wayFactory({
        id: 'w-1',
        nodes: List(['n1']),
        tags: tagsFactory({ highway: 'residential' })
      });

      expect(presetsMatch(point).id).toEqual('vertex');
    });
  });

  //     it('matches vertices on an addr:interpolation line as points', function() {
  //       iD.data.presets = testPresets;
  //       let presets = iD.Context().presets(),
  //         point = iD.Node({ tags: { leisure: 'park' } }),
  //         line = iD.Way({
  //           nodes: [point.id],
  //           tags: { 'addr:interpolation': 'even' }
  //         }),
  //         graph = iD.Graph([point, line]);

  //       expect(presets.match(point, graph).id).toEqual('park');
  //     });
  //   });

  //   describe('#areaKeys', function() {
  //     let testPresets = {
  //       presets: {
  //         'amenity/fuel/shell': {
  //           tags: { amenity: 'fuel' },
  //           geometry: ['point', 'area'],
  //           suggestion: true
  //         },
  //         'highway/foo': {
  //           tags: { highway: 'foo' },
  //           geometry: ['area']
  //         },
  //         'leisure/track': {
  //           tags: { leisure: 'track' },
  //           geometry: ['line', 'area']
  //         },
  //         natural: {
  //           tags: { natural: '*' },
  //           geometry: ['point', 'vertex', 'area']
  //         },
  //         'natural/peak': {
  //           tags: { natural: 'peak' },
  //           geometry: ['point', 'vertex']
  //         },
  //         'natural/tree_row': {
  //           tags: { natural: 'tree_row' },
  //           geometry: ['line']
  //         },
  //         'natural/wood': {
  //           tags: { natural: 'wood' },
  //           geometry: ['point', 'area']
  //         }
  //       }
  //     };

  //     it('whitelists keys for presets with area geometry', function() {
  //       iD.data.presets = testPresets;
  //       const presets = iD.Context().presets();
  //       expect(presets.areaKeys()).toEqual(expect.arrayContaining('natural'));
  //     });

  //     it('blacklists key-values for presets with a line geometry', function() {
  //       iD.data.presets = testPresets;
  //       const presets = iD.Context().presets();
  //       expect(presets.areaKeys().natural).toEqual(
  //         expect.arrayContaining('tree_row')
  //       );
  //       expect(presets.areaKeys().natural.tree_row).toBe(true);
  //     });

  //     it('blacklists key-values for presets with both area and line geometry', function() {
  //       iD.data.presets = testPresets;
  //       let presets = iD.Context().presets();
  //       expect(presets.areaKeys().leisure).toEqual(
  //         expect.arrayContaining('track')
  //       );
  //     });

  //     it('does not blacklist key-values for presets with neither area nor line geometry', function() {
  //       iD.data.presets = testPresets;
  //       const presets = iD.Context().presets();
  //       expect(presets.areaKeys().natural).toEqual(
  //         expect.arrayContaining('peak')
  //       );
  //     });

  //     it("does not blacklist generic '*' key-values", function() {
  //       iD.data.presets = testPresets;
  //       const presets = iD.Context().presets();
  //       expect(presets.areaKeys().natural).toEqual(
  //         expect.arrayContaining('natural')
  //       );
  //     });

  //     it("ignores keys like 'highway' that are assumed to be lines", function() {
  //       iD.data.presets = testPresets;
  //       const presets = iD.Context().presets();
  //       expect(presets.areaKeys()).toEqual(expect.arrayContaining('highway'));
  //     });

  //     it('ignores suggestion presets', function() {
  //       iD.data.presets = testPresets;
  //       const presets = iD.Context().presets();
  //       expect(presets.areaKeys()).toEqual(expect.arrayContaining('amenity'));
  //     });
  //   });

  //   describe('expected matches', function() {
  //     it('prefers building to multipolygon', function() {
  //       iD.data.presets = savedPresets;
  //       const presets = iD.Context().presets(),
  //         relation = iD.Relation({
  //           tags: { type: 'multipolygon', building: 'yes' }
  //         }),
  //         graph = iD.Graph([relation]);
  //       expect(presets.match(relation, graph).id).toEqual('building');
  //     });

  //     it('prefers building to address', function() {
  //       iD.data.presets = savedPresets;
  //       const presets = iD.Context().presets(),
  //         way = iD.Way({
  //           tags: { area: 'yes', building: 'yes', 'addr:housenumber': '1234' }
  //         }),
  //         graph = iD.Graph([way]);
  //       expect(presets.match(way, graph).id).toEqual('building');
  //     });

  //     it('prefers pedestrian to area', function() {
  //       iD.data.presets = savedPresets;
  //       const presets = iD.Context().presets(),
  //         way = iD.Way({ tags: { area: 'yes', highway: 'pedestrian' } }),
  //         graph = iD.Graph([way]);
  //       expect(presets.match(way, graph).id).toEqual('highway/pedestrian');
  //     });
  //   });
});
