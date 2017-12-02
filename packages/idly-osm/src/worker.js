"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var structures_1 = require("idly-common/lib/osm/structures");
var config_1 = require("./config/config");
var node_1 = require("./parsers/node");
var way_1 = require("./parsers/way");
function nameSpaceKeys(name, obj) {
    var newObj = {};
    Object.keys(obj).forEach(function (k) {
        newObj[name + '--' + k] = obj[k];
    });
    return newObj;
}
/**
 * meant to run purely on a separate thread.
 * @param entityTable
 * @param parentWays
 */
function onParseEntities(entityTable, parentWays) {
    console.log('onParseEntities called worker !!!');
    var fProps = new Map();
    entityTable.forEach(function (entity, id) {
        if (entity.type === structures_1.EntityType.NODE) {
            // @TOFIX why do we need to send the entire parentWays lol.
            var x = nameSpaceKeys(config_1.PLUGIN_NAME, node_1.nodePropertiesGen(entity, parentWays.get(entity.id) || immutable_1.Set()));
            fProps.set(id, x);
        }
        if (entity.type === structures_1.EntityType.WAY) {
            fProps.set(id, nameSpaceKeys(config_1.PLUGIN_NAME, way_1.wayPropertiesGen(entity)));
        }
    });
    return fProps;
}
exports.onParseEntities = onParseEntities;
