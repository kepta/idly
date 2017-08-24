"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("idly-common/lib");
const way_1 = require("./parsers/way");
const node_1 = require("./parsers/node");
class IdlyOSM {
    onParseEntities(entities, parentWays) {
        const fProps = new Map();
        for (const [id, entity] of entities) {
            if (entity.type === lib_1.EntityType.NODE) {
                var x = node_1.nodePropertiesGen(entity, parentWays);
                fProps.set(id, x);
            }
            if (entity.type === lib_1.EntityType.WAY) {
                fProps.set(id, way_1.wayPropertiesGen(entity, entities));
            }
        }
        return fProps;
    }
}
exports.IdlyOSM = IdlyOSM;
//# sourceMappingURL=index.js.map