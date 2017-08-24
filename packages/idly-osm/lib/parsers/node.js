"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getNodeGeometry_1 = require("../helpers/getNodeGeometry");
const presets_1 = require("../presets/presets");
exports.DEFAULT_NODE_ICON = 'circle';
function nodePropertiesGen(node, parentWays) {
    return exports.applyNodeMarkup(getNodeGeometry_1.getNodeGeometry(node.id, parentWays), node.tags);
}
exports.nodePropertiesGen = nodePropertiesGen;
exports.applyNodeMarkup = (geometry, tags) => {
    const match = presets_1.presetsMatcherCached(geometry)(tags);
    return {
        icon: (match && match.icon) || exports.DEFAULT_NODE_ICON,
        name: tags.get('name'),
        geometry
    };
};
//# sourceMappingURL=node.js.map