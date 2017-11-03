describe.only('presetIndex', function() {
  var savedPresets;

  //   before(function() {
  //     savedPresets = data.presets;
  //   });

  //   after(function() {
  //     data.presets = savedPresets;
  //   });

  describe('#match', function() {
    var testPresets = {
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
      data.presets = testPresets;
      var presets = Context().presets(),
        way = Way({ tags: { highway: 'residential' } }),
        graph = Graph([way]);

      expect(presets.match(way, graph).id).toEqual('residential');
    });

    it('returns the appropriate fallback preset when no tags match', function() {
      data.presets = testPresets;
      var presets = Context().presets(),
        point = Node(),
        line = Way({ tags: { foo: 'bar' } }),
        graph = Graph([point, line]);

      expect(presets.match(point, graph).id).toEqual('point');
      expect(presets.match(line, graph).id).toEqual('line');
    });

    it('matches vertices on a line as vertices', function() {
      data.presets = testPresets;
      var presets = Context().presets(),
        point = Node({ tags: { leisure: 'park' } }),
        line = Way({ nodes: [point.id], tags: { highway: 'residential' } }),
        graph = Graph([point, line]);

      expect(presets.match(point, graph).id).toEqual('vertex');
    });

    it('matches vertices on an addr:interpolation line as points', function() {
      data.presets = testPresets;
      var presets = Context().presets(),
        point = Node({ tags: { leisure: 'park' } }),
        line = Way({
          nodes: [point.id],
          tags: { 'addr:interpolation': 'even' }
        }),
        graph = Graph([point, line]);

      expect(presets.match(point, graph).id).toEqual('park');
    });
  });

  describe('#areaKeys', function() {
    var testPresets = {
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
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys()).toEqual(expect.arrayContaining('natural'));
    });

    it('blacklists key-values for presets with a line geometry', function() {
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys().natural).toEqual(
        expect.arrayContaining('tree_row')
      );
      expect(presets.areaKeys().natural.tree_row).toBe(true);
    });

    it('blacklists key-values for presets with both area and line geometry', function() {
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys().leisure).toEqual(
        expect.arrayContaining('track')
      );
    });

    it('does not blacklist key-values for presets with neither area nor line geometry', function() {
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys().natural).toEqual(
        expect.arrayContaining('peak')
      );
    });

    it("does not blacklist generic '*' key-values", function() {
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys().natural).toEqual(
        expect.arrayContaining('natural')
      );
    });

    it("ignores keys like 'highway' that are assumed to be lines", function() {
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys()).toEqual(expect.arrayContaining('highway'));
    });

    it('ignores suggestion presets', function() {
      data.presets = testPresets;
      var presets = Context().presets();
      expect(presets.areaKeys()).toEqual(expect.arrayContaining('amenity'));
    });
  });

  describe('expected matches', function() {
    it('prefers building to multipolygon', function() {
      data.presets = savedPresets;
      var presets = Context().presets(),
        relation = Relation({
          tags: { type: 'multipolygon', building: 'yes' }
        }),
        graph = Graph([relation]);
      expect(presets.match(relation, graph).id).toEqual('building');
    });

    it('prefers building to address', function() {
      data.presets = savedPresets;
      var presets = Context().presets(),
        way = Way({
          tags: { area: 'yes', building: 'yes', 'addr:housenumber': '1234' }
        }),
        graph = Graph([way]);
      expect(presets.match(way, graph).id).toEqual('building');
    });

    it('prefers pedestrian to area', function() {
      data.presets = savedPresets;
      var presets = Context().presets(),
        way = Way({ tags: { area: 'yes', highway: 'pedestrian' } }),
        graph = Graph([way]);
      expect(presets.match(way, graph).id).toEqual('highway/pedestrian_area');
    });
  });
});
