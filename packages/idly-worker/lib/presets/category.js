import * as _ from 'lodash';
import { presetCollection } from 'presets/collection';
import { t } from 'presets/t';
export function presetCategory(id, category, all) {
    category = _.clone(category);
    category.id = id;
    category.members = presetCollection(category.members.map(function (idd) {
        return all.item(idd);
    }));
    category.matchGeometry = function (geometry) {
        return category.geometry.indexOf(geometry) >= 0;
    };
    category.matchScore = function () {
        return -1;
    };
    category.name = function () {
        return t('presets.categories.' + id + '.name', { default: id });
    };
    category.terms = function () {
        return [];
    };
    return category;
}
//# sourceMappingURL=category.js.map