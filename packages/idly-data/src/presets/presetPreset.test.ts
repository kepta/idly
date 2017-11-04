import { presetField } from './presetField';
import { presetPreset } from './presetPreset';
// changes
// 1. removed Way() to simple ({}). Since presetPreset just uses entity.tags

describe('presetPreset', function() {
  it('has optional fields', function() {
    var preset = presetPreset('test', {});
    expect(preset.fields).toEqual([]);
  });

  describe('#matchGeometry', function() {
    it("returns false if it doesn't match", function() {
      var preset = presetPreset('test', { geometry: ['line'] });
      expect(preset.matchGeometry('point')).toBe(false);
    });

    it('returns true if it does match', function() {
      var preset = presetPreset('test', { geometry: ['point', 'line'] });
      expect(preset.matchGeometry('point')).toBe(true);
    });
  });

  describe('#matchScore', function() {
    it('returns -1 if preset does not match tags', function() {
      var preset = presetPreset('test', { tags: { foo: 'bar' } });
      // change
      var entity = { tags: { highway: 'motorway' } };
      expect(preset.matchScore(entity.tags)).toBe(-1);
    });

    it('returns the value of the matchScore property when matched', function() {
      var preset = presetPreset('test', {
        tags: { highway: 'motorway' },
        matchScore: 0.2
      });
      // change
      var entity = { tags: { highway: 'motorway' } };
      expect(preset.matchScore(entity.tags)).toBe(0.2);
    });

    it('defaults to the number of matched tags', function() {
      var preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      var entity = { tags: { highway: 'residential' } };
      expect(preset.matchScore(entity.tags)).toBe(1);

      preset = presetPreset('test', {
        tags: { highway: 'service', service: 'alley' }
      });
      entity = { tags: { highway: 'service', service: 'alley' } };
      expect(preset.matchScore(entity.tags)).toBe(2);
    });

    it('counts * as a match for any value with score 0.5', function() {
      var preset = presetPreset('test', { tags: { building: '*' } });
      var entity = { tags: { building: 'yep' } };
      expect(preset.matchScore(entity.tags)).toBe(0.5);
    });
  });

  describe('isFallback', function() {
    it('returns true if preset has no tags', function() {
      var preset = presetPreset('point', { tags: {} });
      expect(preset.isFallback()).toBe(true);
    });

    it("returns true if preset has a single 'area' tag", function() {
      var preset = presetPreset('area', { tags: { area: 'yes' } });
      expect(preset.isFallback()).toBe(true);
    });

    it("returns false if preset has a single non-'area' tag", function() {
      var preset = presetPreset('building', { tags: { building: 'yes' } });
      expect(preset.isFallback()).toBe(false);
    });

    it('returns false if preset has multiple tags', function() {
      var preset = presetPreset('building', {
        tags: { area: 'yes', building: 'yes' }
      });
      expect(preset.isFallback()).toBe(false);
    });
  });

  describe('#applyTags', function() {
    it('adds match tags', function() {
      var preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      expect(preset.applyTags({}, 'line')).toEqual({ highway: 'residential' });
    });

    it("adds wildcard tags with value 'yes'", function() {
      var preset = presetPreset('test', { tags: { building: '*' } });
      expect(preset.applyTags({}, 'area')).toEqual({ building: 'yes' });
    });

    it('prefers to add tags of addTags property', function() {
      var preset = presetPreset('test', {
        tags: { building: '*' },
        addTags: { building: 'ok' }
      });
      expect(preset.applyTags({}, 'area')).toEqual({ building: 'ok' });
    });

    it('adds default tags of fields with matching geometry', function() {
      var field = presetField('field', {
          key: 'building',
          geometry: 'area',
          default: 'yes'
        }),
        preset = presetPreset('test', { fields: ['field'] }, { field: field });
      expect(preset.applyTags({}, 'area')).toEqual({
        area: 'yes',
        building: 'yes'
      });
    });

    it('adds no default tags of fields with non-matching geometry', function() {
      var field = presetField('field', {
          key: 'building',
          geometry: 'area',
          default: 'yes'
        }),
        preset = presetPreset('test', { fields: ['field'] }, { field: field });
      expect(preset.applyTags({}, 'point')).toEqual({});
    });

    describe('for a preset with no tag in areaKeys', function() {
      var preset = presetPreset('test', {
        geometry: ['line', 'area'],
        tags: { name: 'testname', highway: 'pedestrian' }
      });

      it("doesn't add area=yes to non-areas", function() {
        expect(preset.applyTags({}, 'line')).toEqual({
          name: 'testname',
          highway: 'pedestrian'
        });
      });

      it('adds area=yes to areas', function() {
        expect(preset.applyTags({}, 'area')).toEqual({
          name: 'testname',
          highway: 'pedestrian',
          area: 'yes'
        });
      });
    });

    describe('for a preset with a tag in areaKeys', function() {
      it("doesn't add area=yes automatically", function() {
        var preset = presetPreset('test', {
          geometry: ['area'],
          tags: { name: 'testname', natural: 'water' }
        });
        expect(preset.applyTags({}, 'area')).toEqual({
          name: 'testname',
          natural: 'water'
        });
      });
      it('does add area=yes if asked to', function() {
        var preset = presetPreset('test', {
          geometry: ['area'],
          tags: { name: 'testname', area: 'yes' }
        });
        expect(preset.applyTags({}, 'area')).toEqual({
          name: 'testname',
          area: 'yes'
        });
      });
    });
  });

  describe('#removeTags', function() {
    it('removes tags that match preset tags', function() {
      var preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      expect(preset.removeTags({ highway: 'residential' }, 'area')).toEqual({});
    });

    it('removes tags that match field default tags', function() {
      var field = presetField('field', {
          key: 'building',
          geometry: 'area',
          default: 'yes'
        }),
        preset = presetPreset('test', { fields: ['field'] }, { field: field });
      expect(preset.removeTags({ building: 'yes' }, 'area')).toEqual({});
    });

    it('removes area=yes', function() {
      var preset = presetPreset('test', { tags: { highway: 'pedestrian' } });
      expect(
        preset.removeTags({ highway: 'pedestrian', area: 'yes' }, 'area')
      ).toEqual({});
    });

    it('preserves tags that do not match field default tags', function() {
      var field = presetField('field', {
          key: 'building',
          geometry: 'area',
          default: 'yes'
        }),
        preset = presetPreset('test', { fields: ['field'] }, { field: field });
      expect(preset.removeTags({ building: 'yep' }, 'area')).toEqual({
        building: 'yep'
      });
    });

    it('preserves tags that are not listed in removeTags', function() {
      var preset = presetPreset('test', {
        tags: { a: 'b' },
        removeTags: {}
      });
      expect(preset.removeTags({ a: 'b' }, 'area')).toEqual({ a: 'b' });
    });
  });
});
