import { EntityTable, OsmGeometry, Way } from 'idly-common/lib';
export declare function wayPropertiesGen(way: Way, table: EntityTable): {
    name: string;
    icon: any;
    geometry: OsmGeometry;
    tagsClass: string;
    tagsClassType: string;
};