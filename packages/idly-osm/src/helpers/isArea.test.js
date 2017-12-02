"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wayFactory_1 = require("idly-common/lib/osm/wayFactory");
var tagsFactory_1 = require("idly-common/lib/osm/tagsFactory");
var isArea_1 = require("../helpers/isArea");
describe('#isArea', function () {
    //   const w1 = wayFactory({ id: 'w-1' });
    it('uses weak cache', function () {
        var w1 = wayFactory_1.wayFactory({
            id: 'w-1',
            nodes: ['n1', 'n1'],
            tags: tagsFactory_1.tagsFactory({ 'building': 'yes' })
        });
        expect(isArea_1.isArea(w1)).toEqual(true);
        expect(isArea_1.isArea(w1)).toEqual(true);
    });
    it('returns false when the way has no tags', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({ id: 'w-1' }))).toEqual(false);
    });
    it('returns true if the way has tag area=yes', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({ id: 'w-1', tags: tagsFactory_1.tagsFactory({ 'area': 'yes' }) }))).toEqual(true);
    });
    it('returns false if the way is closed and has no tags', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({ id: 'w-1', nodes: ['n1', 'n1'] }))).toEqual(false);
    });
    it('returns true if the way is closed and has a key in areaKeys', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({
            id: 'w-1',
            nodes: ['n1', 'n1'],
            tags: tagsFactory_1.tagsFactory({ 'building': 'yes' })
        }))).toEqual(true);
    });
    it('returns false if the way is closed and has no keys in areaKeys', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({
            id: 'w-1',
            nodes: ['n1', 'n1'],
            tags: tagsFactory_1.tagsFactory({ 'a': 'b' })
        }))).toBe(false);
    });
    it('returns false if the way is closed and has tag area=no', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({
            id: 'w-1',
            nodes: ['n1', 'n1'],
            tags: tagsFactory_1.tagsFactory({ 'area': 'no', 'building': 'yes' })
        }))).toBe(false);
    });
    it('returns false for coastline', function () {
        expect(isArea_1.isArea(wayFactory_1.wayFactory({
            id: 'w-1',
            nodes: ['n1', 'n1'],
            tags: tagsFactory_1.tagsFactory({ 'natural': 'coastline' })
        }))).toBe(false);
    });
});
