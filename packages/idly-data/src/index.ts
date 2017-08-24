import { categories } from './data/presets/categories.json';
import { defaults } from './data/presets/defaults.json';
import { fields } from './data/presets/fields.json';
import { presets } from './data/presets/presets.json';

export const osmPavedTags = {
  surface: {
    paved: true,
    asphalt: true,
    concrete: true
  },
  tracktype: {
    grade1: true
  }
};

export const presetsData = {
  presets: {
    presets,
    defaults,
    categories,
    fields
  }
};
