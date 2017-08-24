"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dummyParentWaysGen(obj) {
    const parentWays = new Map();
    Object.keys(obj).forEach(k => parentWays.set(k, obj[k]));
    return parentWays;
}
exports.dummyParentWaysGen = dummyParentWaysGen;
//# sourceMappingURL=dummyParentWaysGen.js.map