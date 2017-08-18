import { nodeFactory } from 'structs/node';
import { genLngLat } from 'structs/lngLat';
import { propertiesGen } from 'structs/properties';
describe('osmNode', function () {
    it('returns a node', function () {
        // expect(nodeFactory()).toBeInstanceOf(Node);
        expect(nodeFactory({ id: 'n-1' }).type).toEqual('node');
        expect(nodeFactory({ id: 'n-1' }).id).toEqual('n-1');
        expect(nodeFactory({ id: 'n-1' }).loc).toEqual(genLngLat([0, 0]));
        expect(nodeFactory({ id: 'n-1' }).properties).toEqual(propertiesGen({}));
    });
    it('defaults tags to an empty object', function () {
        expect(nodeFactory({ id: 'n-1' }).tags).toEqual(new Map());
    });
    it('sets tags as specified', function () {
        expect(nodeFactory({ id: 'n-1', tags: new Map().set('foo', 'bar') }).tags).toEqual(new Map().set('foo', 'bar'));
    });
    it('sets loc correctly', function () {
        expect(nodeFactory({ id: 'n-1', loc: genLngLat({ lon: 5, lat: 10 }) }).loc).toEqual(genLngLat({ lon: 5, lat: 10 }));
    });
});
//# sourceMappingURL=node.test.js.map