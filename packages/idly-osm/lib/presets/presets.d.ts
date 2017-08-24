import { OsmGeometry } from 'idly-common/lib';
import { Map as ImmutableMap } from 'immutable';
export declare class Index {
    private point;
    private vertex;
    private line;
    private area;
    private relation;
    constructor(o?: {});
    set(g: OsmGeometry, value: {}): void;
    get(g: OsmGeometry): {};
}
export declare function initPresets(d?: {}): {
    all: {
        collection: any;
        item(id: any): any;
        matchGeometry(geometry: any): any;
        search(value: any, geometry: any): any;
    };
    recent: {
        collection: any;
        item(id: any): any;
        matchGeometry(geometry: any): any;
        search(value: any, geometry: any): any;
    };
    index: Index;
    defaults: Index;
};
export declare const presets: {
    all;
    defaults;
    index;
    recent;
};
export declare const areaKeys: ImmutableMap<string, ImmutableMap<string, boolean>>;
export declare const presetsMatcher: (geometry: OsmGeometry, tags: Map<string, string>) => any;
export declare const presetsMatcherPoint: (arg: Map<string, string>) => any;
export declare const presetsMatcherVertex: (arg: Map<string, string>) => any;
export declare const presetsMatcherLine: (arg: Map<string, string>) => any;
export declare const presetsMatcherAREA: (arg: Map<string, string>) => any;
export declare const presetsMatcherVertexShared: (arg: Map<string, string>) => any;
export declare const presetsMatcherCached: (geometry: OsmGeometry) => (arg: Map<string, string>) => any;
