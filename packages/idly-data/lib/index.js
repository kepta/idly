"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var categories_json_1 = require("../id-data/presets/categories.json");
var defaults_json_1 = require("../id-data/presets/defaults.json");
var fields_json_1 = require("../id-data/presets/fields.json");
var presets_json_1 = require("../id-data/presets/presets.json");
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