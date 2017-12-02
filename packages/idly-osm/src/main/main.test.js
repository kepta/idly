"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodeFactory_1 = require("idly-common/lib/osm/nodeFactory");
var genLngLat_1 = require("idly-common/lib/osm/genLngLat");
var tagsFactory_1 = require("idly-common/lib/osm/tagsFactory");
var wayFactory_1 = require("idly-common/lib/osm/wayFactory");
var entityTableGen_1 = require("idly-common/lib/osm/entityTableGen");
var worker_1 = require("../worker");
var dummyParentWaysGen_1 = require("../helpers/dummyParentWaysGen");
var immutable_1 = require("immutable");
describe('test IdlyOSM', function () {
    describe('onParseEntities', function () {
        var n1 = nodeFactory_1.nodeFactory({
            id: 'n1',
            loc: genLngLat_1.genLngLat({ lon: 15, lat: 10 }),
            tags: tagsFactory_1.tagsFactory({ k: 'k' })
        });
        var n2 = nodeFactory_1.nodeFactory({
            id: 'n2',
            loc: genLngLat_1.genLngLat({ lon: 5, lat: 12 }),
            tags: tagsFactory_1.tagsFactory({ k: 'k' })
        });
        var n3 = nodeFactory_1.nodeFactory({
            id: 'n3',
            loc: genLngLat_1.genLngLat({ lon: 15, lat: 10 }),
            tags: tagsFactory_1.tagsFactory({ k: 'k' })
        });
        var n4 = nodeFactory_1.nodeFactory({
            id: 'n4',
            loc: genLngLat_1.genLngLat({ lon: 0, lat: 10 }),
            tags: tagsFactory_1.tagsFactory({ k: 'k' })
        });
        var w1 = wayFactory_1.wayFactory({
            id: 'w1',
            nodes: ['n1', 'n2', 'n4'],
            tags: tagsFactory_1.tagsFactory({ highway: 'residential' })
        });
        var w2 = wayFactory_1.wayFactory({
            id: 'w2',
            nodes: ['n1', 'n3'],
            tags: tagsFactory_1.tagsFactory({ highway: 'residential' })
        });
        var table = entityTableGen_1.entityTableGen([n1, n2, n3, n4, w1, w2]);
        var parentWays = dummyParentWaysGen_1.dummyParentWaysGen({
            n1: immutable_1.Set(['w1', 'w2']),
            n2: immutable_1.Set(['w1']),
            n3: immutable_1.Set(['w2']),
            n4: immutable_1.Set(['w1'])
        });
        it('should name space properties', function () {
            var propsAdded = worker_1.onParseEntities(table, parentWays);
            expect(propsAdded).toMatchSnapshot();
        });
    });
});
