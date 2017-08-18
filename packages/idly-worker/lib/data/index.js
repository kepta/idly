export { wikipedia as dataWikipedia } from 'wmf-sitematrix';
export { default as dataSuggestions } from 'name-suggestion-index/name-suggestions.json';
export { dataAddressFormats } from 'data/address-formats.json';
export { dataDeprecated } from 'data/deprecated.json';
export { dataDiscarded } from 'data/discarded.json';
export { dataLocales } from 'data/locales.json';
export { dataPhoneFormats } from 'data/phone-formats.json';
export { dataShortcuts } from 'data/shortcuts.json';
export { default as dataImperial } from 'data/imperial.json';
export { default as dataDriveLeft } from 'data/drive-left.json';
// export { en as dataEn } from '../dist/locales/en.json';
import { dataImagery } from 'data/imagery.json';
import { categories } from 'data/presets/categories.json';
import { defaults } from 'data/presets/defaults.json';
import { fields } from 'data/presets/fields.json';
import { presets } from 'data/presets/presets.json';
// import maki from '@mapbox/maki';
// export var dataFeatureIcons = maki.layouts.all.all;
export let data = {
    imagery: dataImagery,
    presets: {
        presets,
        defaults,
        categories,
        fields
    }
};
//# sourceMappingURL=index.js.map