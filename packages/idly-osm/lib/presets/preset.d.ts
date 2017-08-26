import { OsmGeometry, Tags } from 'idly-common/lib/osm/structures';
import { AreaKeys } from '../presets/areaKeys';
export declare function presetPreset(id: any, preset: any, fields?: {}): {
    /**
     * @NOTE: These are manually typed
     *  might need to cross check with implementation
     */
    matchScore: (tags: Tags) => number;
    matchGeometry: (geometry: OsmGeometry) => boolean;
    t: (scope, options) => string;
    name: () => string;
    applyTags: (tags, geometry: OsmGeometry, areaKeys: AreaKeys) => object;
    isFallback: () => boolean;
    removeTags: (tags, geometry: OsmGeometry) => object;
    fields: {};
};
