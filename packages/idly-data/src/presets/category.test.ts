import { presetCollection } from './collection';
import { presetCategory } from './category';
import { presetPreset } from './presetPreset';
// matches iD test

describe('presetCategory', function() {
  let category;
  let residential;

  beforeEach(function() {
    category = {
      geometry: 'line',
      icon: 'highway',
      name: 'roads',
      members: ['highway/residential']
    };
    residential = presetPreset('highway/residential', {
      tags: {
        highway: 'residential'
      },
      geometry: ['line']
    });
  });

  it('maps members names to preset instances', function() {
    const c = presetCategory('road', category, presetCollection([residential]));
    expect(c.members.collection[0]).toEqual(residential);
  });

  describe('#matchGeometry', function() {
    it('matches the type of an entity', function() {
      const c = presetCategory(
        'road',
        category,
        presetCollection([residential])
      );
      expect(c.matchGeometry('line')).toEqual(true);
      expect(c.matchGeometry('point')).toEqual(false);
    });
  });
});
