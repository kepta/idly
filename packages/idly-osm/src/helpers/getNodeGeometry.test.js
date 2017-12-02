"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var structures_1 = require("idly-common/lib/osm/structures");
var getNodeGeometry_1 = require("../helpers/getNodeGeometry");
var immutable_1 = require("immutable");
function genParentWays() {
    var obj = {
        n3780767744: immutable_1.Set(['w40542208']),
        n4558992269: immutable_1.Set(['w40542208']),
        n253179996: immutable_1.Set(['w40882200', 'w237684574', 'w173431854', 'w450548831']),
        n1485636774: immutable_1.Set(['w40882200', 'w135262258'])
    };
    var parentWays = immutable_1.Map(obj);
    // Object.keys(obj).forEach(k => parentWays.set(k, obj[k]));
    return parentWays;
}
describe('getNodeGeometry', function () {
    it('should work for empty parentWays', function () {
        // @TOFIX new set after we move to immutable
        expect(getNodeGeometry_1.getNodeGeometry('n1', immutable_1.Set())).toEqual(structures_1.OsmGeometry.POINT);
    });
    // it('should work for not matching parentWays', () => {
    //   expect(getNodeGeometry('n1', genParentWays().get('n1'))).toEqual(
    //     OsmGeometry.POINT
    //   );
    // });
    it('should give vertex when inside a way', function () {
        expect(getNodeGeometry_1.getNodeGeometry('n3780767744', genParentWays().get('n3780767744'))).toEqual(structures_1.OsmGeometry.VERTEX);
    });
    it('should give VERTEX when shared between vertices', function () {
        expect(getNodeGeometry_1.getNodeGeometry('n253179996', genParentWays().get('n253179996'))).toEqual(structures_1.OsmGeometry.VERTEX);
    });
});
