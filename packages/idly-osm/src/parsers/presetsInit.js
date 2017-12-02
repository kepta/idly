"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var presetIndex_1 = require("idly-data/lib/presets/presetIndex");
exports.all = presetIndex_1.presetIndex().init();
exports.presetMatch = exports.all.match;
