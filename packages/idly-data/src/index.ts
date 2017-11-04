import { categories } from '../id-data/presets/categories.json';
import { defaults } from '../id-data/presets/defaults.json';
import { fields } from '../id-data/presets/fields.json';
import { presets } from '../id-data/presets/presets.json';

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
