"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var presetsInit_1 = require("./presetsInit");
var weakCache_1 = require("idly-common/lib/misc/weakCache");
var getNodeGeometry_1 = require("../helpers/getNodeGeometry");
exports.DEFAULT_NODE_ICON = 'circle';
exports.nodePropertiesGen = weakCache_1.weakCache2(function (node, parentWay) {
    return exports.applyNodeMarkup(getNodeGeometry_1.getNodeGeometry(node.id, parentWay), node.tags);
});
exports.applyNodeMarkup = function (geometry, tags) {
    var match = presetsInit_1.presetMatch(tags, geometry); //presetsMatcherCached(geometry)(tags);
    return {
        icon: (match && match.icon) || exports.DEFAULT_NODE_ICON,
        name: tags['name'],
        geometry: geometry
    };
};
