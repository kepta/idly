"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodeFactory_1 = require("idly-common/lib/osm/nodeFactory");
var genLngLat_1 = require("idly-common/lib/osm/genLngLat");
var wayFactory_1 = require("idly-common/lib/osm/wayFactory");
var tagsFactory_1 = require("idly-common/lib/osm/tagsFactory");
var entityTableGen_1 = require("idly-common/lib/osm/entityTableGen");
var way_1 = require("../parsers/way");
describe('wayCombiner', function () {
    var n1 = nodeFactory_1.nodeFactory({ id: 'n1', loc: genLngLat_1.genLngLat([1, 2]) });
    var n2 = nodeFactory_1.nodeFactory({ id: 'n2', loc: genLngLat_1.genLngLat([3, 4]) });
    var n3 = nodeFactory_1.nodeFactory({ id: 'n3', loc: genLngLat_1.genLngLat([1, 4]) });
    var node = nodeFactory_1.nodeFactory({ id: 'n1' });
    var way = wayFactory_1.wayFactory({
        id: 'w1',
        nodes: ['n1'],
        tags: tagsFactory_1.tagsFactory({ 'highway': 'residential' })
    });
    var g = entityTableGen_1.entityTableGen([n1, n2, n3]);
    it('should behave...', function () {
        var result = way_1.wayPropertiesGen(way);
        expect(result).toMatchSnapshot();
    });
    it('should take name', function () {
        var w2 = wayFactory_1.wayFactory({
            id: 'w1',
            nodes: ['n1'],
            tags: tagsFactory_1.tagsFactory({ 'highway': 'residential', 'name': 'great highway' })
        });
        var gg = entityTableGen_1.entityTableGen([node, w2]);
        var result = way_1.wayPropertiesGen(w2);
        expect(result.name).toEqual('great highway');
    });
});
