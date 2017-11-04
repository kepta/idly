import { presetCollection } from './collection';
import { presetPreset } from './presetPreset';

describe('presetCollection', function() {
  var p = {
    point: presetPreset('point', {
      name: 'Point',
      tags: {},
      geometry: ['point']
    }),
    line: presetPreset('line', {
      name: 'Line',
      tags: {},
      geometry: ['line']
    }),
    area: presetPreset('area', {
      name: 'Area',
      tags: {},
      geometry: ['area']
    }),
    grill: presetPreset('__test/amenity/bbq', {
      name: 'Grill',
      tags: { amenity: 'bbq' },
      geometry: ['point'],
      terms: []
    }),
    sandpit: presetPreset('__test/amenity/grit_bin', {
      name: 'Sandpit',
      tags: { amenity: 'grit_bin' },
      geometry: ['point'],
      terms: []
    }),
    residential: presetPreset('__test/highway/residential', {
      name: 'Residential Area',
      tags: { highway: 'residential' },
      geometry: ['point', 'area'],
      terms: []
    }),
    grass1: presetPreset('__test/landuse/grass1', {
      name: 'Grass',
      tags: { landuse: 'grass' },
      geometry: ['point', 'area'],
      terms: []
    }),
    grass2: presetPreset('__test/landuse/grass2', {
      name: 'Ğṝȁß',
      tags: { landuse: 'ğṝȁß' },
      geometry: ['point', 'area'],
      terms: []
    }),
    park: presetPreset('__test/leisure/park', {
      name: 'Park',
      tags: { leisure: 'park' },
      geometry: ['point', 'area'],
      terms: ['grass'],
      matchScore: 0.5
    }),
    parking: presetPreset('__test/amenity/parking', {
      name: 'Parking',
      tags: { amenity: 'parking' },
      geometry: ['point', 'area'],
      terms: ['cars']
    }),
    soccer: presetPreset('__test/leisure/pitch/soccer', {
      name: 'Soccer Field',
      tags: { leisure: 'pitch', sport: 'soccer' },
      geometry: ['point', 'area'],
      terms: ['fußball']
    }),
    football: presetPreset('__test/leisure/pitch/american_football', {
      name: 'Football Field',
      tags: { leisure: 'pitch', sport: 'american_football' },
      geometry: ['point', 'area'],
      terms: ['gridiron']
    })
  };

  var c = presetCollection([
    p.point,
    p.line,
    p.area,
    p.grill,
    p.sandpit,
    p.residential,
    p.grass1,
    p.grass2,
    p.park,
    p.parking,
    p.soccer,
    p.football
  ]);

  describe('#item', function() {
    it('fetches a preset by id', function() {
      expect(c.item('__test/highway/residential')).toBe(p.residential);
    });
  });

  describe('#matchGeometry', function() {
    it('returns a new collection only containing presets matching a geometry', function() {
      expect(c.matchGeometry('area').collection).toEqual(
        expect.arrayContaining([
          p.area,
          p.residential,
          p.park,
          p.soccer,
          p.football
        ])
      );
    });
  });

  describe('#search', function() {
    it('matches leading name', function() {
      var col = c.search('resid', 'area').collection;
      expect(col.indexOf(p.residential)).toEqual(0); // 1. 'Residential' (by name)
    });

    it('returns alternate matches in correct order', function() {
      var col = c.search('gri', 'point').matchGeometry('point').collection;
      expect(col.indexOf(p.grill)).toEqual(0); // 1. 'Grill' (leading name)
      expect(col.indexOf(p.football)).toEqual(1); // 2. 'Football' (leading term 'gridiron')
      expect(col.indexOf(p.sandpit)).toEqual(2); // 3. 'Sandpit' (leading tag value 'grit_bin')
      expect(col.indexOf(p.grass1)).toBeGreaterThanOrEqual(3);
      expect(col.indexOf(p.grass1)).toBeLessThanOrEqual(5); // 4. 'Grass' (similar name)
      expect(col.indexOf(p.grass2)).toBeGreaterThanOrEqual(3);
      expect(col.indexOf(p.grass2)).toBeLessThanOrEqual(5); // 5. 'Ğṝȁß' (similar name)
      expect(col.indexOf(p.park)).toBeGreaterThanOrEqual(3);
      expect(col.indexOf(p.park)).toBeLessThanOrEqual(5); // 6. 'Park' (similar term 'grass')
    });

    it('sorts preset with matchScore penalty below others', function() {
      var col = c.search('par', 'point').matchGeometry('point').collection;
      expect(col.indexOf(p.parking)).toEqual(0); // 1. 'Parking' (default matchScore)
      expect(col.indexOf(p.park)).toEqual(1); // 2. 'Park' (low matchScore)
    });

    it('ignores matchScore penalty for exact name match', function() {
      var col = c.search('park', 'point').matchGeometry('point').collection;
      expect(col.indexOf(p.park)).toEqual(0); // 1. 'Park' (low matchScore)
      expect(col.indexOf(p.parking)).toEqual(1); // 2. 'Parking' (default matchScore)
    });

    it('considers diacritics on exact matches', function() {
      var col = c.search('ğṝȁ', 'point').matchGeometry('point').collection;
      expect(col.indexOf(p.grass2)).toEqual(0); // 1. 'Ğṝȁß'  (leading name)
      expect(col.indexOf(p.grass1)).toEqual(1); // 2. 'Grass' (similar name)
    });

    it('replaces diacritics on fuzzy matches', function() {
      var col = c.search('graß', 'point').matchGeometry('point').collection;
      expect(col.indexOf(p.grass1)).toBeGreaterThanOrEqual(0);
      expect(col.indexOf(p.grass1)).toBeLessThanOrEqual(1); // 1. 'Grass' (similar name)
      expect(col.indexOf(p.grass2)).toBeGreaterThanOrEqual(0);
      expect(col.indexOf(p.grass2)).toBeLessThanOrEqual(1); // 2. 'Ğṝȁß'  (similar name)
    });

    it('includes the appropriate fallback preset', function() {
      expect(c.search('foo', 'point').collection).toContain(p.point);
      expect(c.search('foo', 'line').collection).toContain(p.line);
      expect(c.search('foo', 'area').collection).toContain(p.area);
    });

    it('excludes presets with searchable: false', function() {
      var excluded = presetPreset('__test/excluded', {
          name: 'excluded',
          tags: { amenity: 'excluded' },
          geometry: ['point'],
          searchable: false
        }),
        collection = presetCollection([excluded, p.point]);
      expect(collection.search('excluded', 'point').collection).not.toContain(
        excluded
      );
    });
  });
});
