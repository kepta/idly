"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("./worker");
const Test_1 = require("./ui/Test");
exports.PLUGIN_NAME = 'osm_basic';
exports.plugin = {
    name: exports.PLUGIN_NAME,
    description: 'Core osm functionality for jalebi editor',
    uiComponents: [Test_1.TestOsm],
    actions: [],
    workers: [worker_1.onParseEntities]
};
exports.default = exports.plugin;
//# sourceMappingURL=index.js.map