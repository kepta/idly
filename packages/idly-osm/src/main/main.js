"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config/config");
var worker_1 = require("../worker");
var NewTagsEditor_1 = require("../ui/NewTagsEditor");
// @TODO separate workers,
//  for a smaller build
exports.plugin = {
    name: config_1.PLUGIN_NAME,
    description: 'Core osm functionality for jalebi editor',
    uiComponents: [NewTagsEditor_1.NewTagsEditor],
    actions: [],
    workers: [worker_1.onParseEntities]
};
