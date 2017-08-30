"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories_json_1 = require("./data/presets/categories.json");
const defaults_json_1 = require("./data/presets/defaults.json");
const fields_json_1 = require("./data/presets/fields.json");
const presets_json_1 = require("./data/presets/presets.json");
exports.osmPavedTags = {
    surface: {
        paved: true,
        asphalt: true,
        concrete: true
    },
    tracktype: {
        grade1: true
    }
};
exports.presetsData = {
    presets: {
        presets: presets_json_1.presets,
        defaults: defaults_json_1.defaults,
        categories: categories_json_1.categories,
        fields: fields_json_1.fields
    }
};
//# sourceMappingURL=index.js.map