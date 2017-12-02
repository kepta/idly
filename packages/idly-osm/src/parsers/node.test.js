"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodeFactory_1 = require("idly-common/lib/osm/nodeFactory");
var genLngLat_1 = require("idly-common/lib/osm/genLngLat");
var tagsFactory_1 = require("idly-common/lib/osm/tagsFactory");
var structures_1 = require("idly-common/lib/osm/structures");
var dummyParentWaysGen_1 = require("../helpers/dummyParentWaysGen");
var node_1 = require("../parsers/node");
var immutable_1 = require("immutable");
var n1 = nodeFactory_1.nodeFactory({ id: 'n-1' });
var n11 = nodeFactory_1.nodeFactory({
    id: 'n-1',
    loc: genLngLat_1.genLngLat({ lon: 15, lat: 10 }),
    tags: tagsFactory_1.tagsFactory({ k: 'k' })
});
var dummyParentWays = dummyParentWaysGen_1.dummyParentWaysGen({
    n3780767744: immutable_1.Set(['w40542208']),
    n4558992269: immutable_1.Set(['w40542208']),
    n253179996: immutable_1.Set(['w40882200', 'w237684574', 'w173431854', 'w450548831']),
    n1485636774: immutable_1.Set(['w40882200', 'w135262258'])
});
describe('node property generator', function () {
    it('should work', function () {
        // @TOFIX change to immutable once finsished rolling out
        expect(node_1.nodePropertiesGen(n1, dummyParentWays.get(n1.id) || immutable_1.Set())).toMatchSnapshot();
    });
    describe('applyNodeMarkup', function () {
        it('should work', function () {
            var markup = node_1.applyNodeMarkup(structures_1.OsmGeometry.POINT, tagsFactory_1.tagsFactory({ k: 'k' }));
            expect(markup).toEqual({
                icon: node_1.DEFAULT_NODE_ICON,
                name: undefined,
                geometry: structures_1.OsmGeometry.POINT
            });
        });
        it('should get the icon', function () {
            var markup = node_1.applyNodeMarkup(structures_1.OsmGeometry.POINT, tagsFactory_1.tagsFactory({ k: 'k' }));
            expect(markup).toEqual({
                icon: node_1.DEFAULT_NODE_ICON,
                name: undefined,
                geometry: structures_1.OsmGeometry.POINT
            });
        });
        it('should get the name', function () {
            var markup = node_1.applyNodeMarkup(structures_1.OsmGeometry.POINT, tagsFactory_1.tagsFactory({ name: 'whatsInTheName' }));
            expect(markup).toEqual({
                icon: node_1.DEFAULT_NODE_ICON,
                name: 'whatsInTheName',
                geometry: structures_1.OsmGeometry.POINT
            });
        });
    });
});
