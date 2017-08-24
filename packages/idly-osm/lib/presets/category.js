"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const collection_1 = require("../presets/collection");
const t_1 = require("../presets/t");
function presetCategory(id, category, all) {
    category = _.clone(category);
    category.id = id;
    category.members = collection_1.presetCollection(category.members.map(function (idd) {
        return all.item(idd);
    }));
    category.matchGeometry = function (geometry) {
        return category.geometry.indexOf(geometry) >= 0;
    };
    category.matchScore = function () {
        return -1;
    };
    category.name = function () {
        return t_1.t('presets.categories.' + id + '.name', { default: id });
    };
    category.terms = function () {
        return [];
    };
    return category;
}
exports.presetCategory = presetCategory;
//# sourceMappingURL=category.js.map