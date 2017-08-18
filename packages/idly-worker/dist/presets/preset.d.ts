import { Geometry } from 'structs/geometry';
import { Tags } from 'structs/tags';
import { AreaKeys } from 'presets/areaKeys';
export declare function presetPreset(id: any, preset: any, fields?: {}): {
    /**
     * @NOTE: These are manually typed
     *  might need to cross check with implementation
     */
    matchScore: (tags: Tags) => number;
    matchGeometry: (geometry: Geometry) => boolean;
    t: (scope, options) => string;
    name: () => string;
    applyTags: (tags, geometry: Geometry, areaKeys: AreaKeys) => object;
    isFallback: () => boolean;
    removeTags: (tags, geometry: Geometry) => object;
    fields: {};
};
