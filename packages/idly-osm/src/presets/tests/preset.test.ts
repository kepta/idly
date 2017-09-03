import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';
import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';

import { initAreaKeys } from '../../presets/areaKeys';
import { presetField } from '../../presets/field';
import { presetPreset } from '../../presets/preset';
import { initPresets } from '../../presets/presets';
describe('presetPreset', function() {
  it('has optional fields', function() {
    const preset = presetPreset('test', {});
    expect(preset.fields).toEqual([]);
  });

  describe('#matchGeometry', function() {
    it("returns false if it doesn't match", function() {
      const preset = presetPreset('test', { geometry: [OsmGeometry.LINE] });
      expect(preset.matchGeometry(OsmGeometry.POINT)).toBe(false);
    });

    it('returns true if it does match', function() {
      const preset = presetPreset('test', {
        geometry: [OsmGeometry.POINT, OsmGeometry.LINE]
      });
      expect(preset.matchGeometry(OsmGeometry.POINT)).toBe(true);
    });
  });

  describe('#matchScore', function() {
    const way1 = wayFactory({
      id: 'w-1',
      tags: tagsFactory([['highway', 'motorway']])
    });
    it('returns -1 if preset does not match tags', function() {
      const preset = presetPreset('test', { tags: { foo: 'bar' } });
      expect(preset.matchScore(way1.tags)).toBe(-1);
    });

    it('returns the value of the matchScore property when matched', function() {
      const preset = presetPreset('test', {
        tags: { highway: 'motorway' },
        matchScore: 0.2
      });
      const entity = way1;
      expect(preset.matchScore(entity.tags)).toBe(0.2);
    });

    it('defaults to the number of matched tags', function() {
      let preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      let entity = wayFactory({
        id: 'w-2',
        tags: tagsFactory([['highway', 'residential']])
      });
      expect(preset.matchScore(entity.tags)).toBe(1);

      preset = presetPreset('test', {
        tags: { highway: 'service', service: 'alley' }
      });
      entity = wayFactory({
        id: 'w-3',
        tags: tagsFactory([['highway', 'service'], ['service', 'alley']])
      });
      expect(preset.matchScore(entity.tags)).toBe(2);
    });

    it('counts * as a match for any value with score 0.5', function() {
      const preset = presetPreset('test', { tags: { building: '*' } });
      const entity = wayFactory({
        id: 'w-3',
        tags: tagsFactory([['building', 'yep']])
      });
      expect(preset.matchScore(entity.tags)).toBe(0.5);
    });
  });

  describe('isFallback', function() {
    it('returns true if preset has no tags', function() {
      const preset = presetPreset(OsmGeometry.POINT, { tags: {} });
      expect(preset.isFallback()).toBe(true);
    });

    it('returns true if preset has a single AREA tag', function() {
      const preset = presetPreset(OsmGeometry.AREA, { tags: { area: 'yes' } });
      expect(preset.isFallback()).toBe(true);
    });

    it('returns false if preset has a single AREA tag', function() {
      const preset = presetPreset('building', { tags: { building: 'yes' } });
      expect(preset.isFallback()).toBe(false);
    });

    it('returns false if preset has multiple tags', function() {
      const preset = presetPreset('building', {
        tags: { area: 'yes', building: 'yes' }
      });
      expect(preset.isFallback()).toBe(false);
    });
  });

  describe('#applyTags', function() {
    const { all, defaults, index, recent } = initPresets();
    const areaKeys = initAreaKeys(all);
    // const curriedPresetsMatch = R.curry(presetsMatch)(all, index, areaKeys);

    it('adds match tags', function() {
      const preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      expect(preset.applyTags({}, OsmGeometry.LINE, areaKeys)).toEqual({
        highway: 'residential'
      });
    });

    it("adds wildcard tags with value 'yes'", function() {
      const preset = presetPreset('test', { tags: { building: '*' } });
      expect(preset.applyTags({}, OsmGeometry.AREA, areaKeys)).toEqual({
        building: 'yes'
      });
    });

    it('prefers to add tags of addTags property', function() {
      const preset = presetPreset('test', {
        tags: { building: '*' },
        addTags: { building: 'ok' }
      });
      expect(preset.applyTags({}, OsmGeometry.AREA, areaKeys)).toEqual({
        building: 'ok'
      });
    });

    it('adds default tags of fields with matching geometry', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: OsmGeometry.AREA,
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.applyTags({}, OsmGeometry.AREA, areaKeys)).toEqual({
        area: 'yes',
        building: 'yes'
      });
    });

    it('adds no default tags of fields with non-matching geometry', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: OsmGeometry.AREA,
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.applyTags({}, OsmGeometry.POINT, areaKeys)).toEqual({});
    });

    describe('for a preset with no tag in areaKeys', function() {
      const preset = presetPreset('test', {
        geometry: [OsmGeometry.LINE, OsmGeometry.AREA],
        tags: { name: 'testName', highway: 'pedestrian' }
      });

      it("doesn't add area=yes to non-areas", function() {
        expect(preset.applyTags({}, OsmGeometry.LINE, areaKeys)).toEqual({
          name: 'testName',
          highway: 'pedestrian'
        });
      });

      it('adds area=yes to areas', function() {
        expect(preset.applyTags({}, OsmGeometry.AREA, areaKeys)).toEqual({
          name: 'testName',
          highway: 'pedestrian',
          area: 'yes'
        });
      });
    });

    describe('for a preset with a tag in areaKeys', function() {
      const preset = presetPreset('test', {
        geometry: [OsmGeometry.AREA],
        tags: { name: 'testName', natural: 'water' }
      });
      it("doesn't add area=yes", function() {
        expect(preset.applyTags({}, OsmGeometry.AREA, areaKeys)).toEqual({
          name: 'testName',
          natural: 'water'
        });
      });
    });
  });

  describe('#removeTags', function() {
    it('removes tags that match preset tags', function() {
      const preset = presetPreset('test', {
        tags: { highway: 'residential' }
      });
      expect(
        preset.removeTags({ highway: 'residential' }, OsmGeometry.AREA)
      ).toEqual({});
    });

    it('removes tags that match field default tags', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: OsmGeometry.AREA,
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.removeTags({ building: 'yes' }, OsmGeometry.AREA)).toEqual(
        {}
      );
    });

    it('removes area=yes', function() {
      const preset = presetPreset('test', { tags: { highway: 'pedestrian' } });
      expect(
        preset.removeTags(
          { highway: 'pedestrian', area: 'yes' },
          OsmGeometry.AREA
        )
      ).toEqual({});
    });

    it('preserves tags that do not match field default tags', function() {
      const field = presetField('field', {
        key: 'building',
        geometry: OsmGeometry.AREA,
        default: 'yes'
      });
      const preset = presetPreset('test', { fields: ['field'] }, { field });
      expect(preset.removeTags({ building: 'yep' }, OsmGeometry.AREA)).toEqual({
        building: 'yep'
      });
    });

    it('preserves tags that are not listed in removeTags', function() {
      const preset = presetPreset('test', {
        tags: { a: 'b' },
        removeTags: {}
      });
      expect(preset.removeTags({ a: 'b' }, OsmGeometry.AREA)).toEqual({
        a: 'b'
      });
    });
  });
});
