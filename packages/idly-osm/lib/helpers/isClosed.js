"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isClosed(entity) {
    return (entity.nodes.length > 1 &&
        entity.nodes[0] === entity.nodes[entity.nodes.length - 1]);
}
exports.isClosed = isClosed;
//# sourceMappingURL=isClosed.js.map