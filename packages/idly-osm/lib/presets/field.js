"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const t_1 = require("../presets/t");
function presetField(id, field) {
    field = _.clone(field);
    field.id = id;
    field.matchGeometry = function (geometry) {
        return !field.geometry || field.geometry === geometry;
    };
    field.t = function (scope, options) {
        return t_1.t('presets.fields.' + id + '.' + scope, options);
    };
    field.label = function () {
        return field.t('label', { default: id });
    };
    const placeholder = field.placeholder;
    field.placeholder = function () {
        return field.t('placeholder', { default: placeholder });
    };
    return field;
}
exports.presetField = presetField;
//# sourceMappingURL=field.js.map