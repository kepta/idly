import { Node, NodeGeometry, ParentWays, OsmGeometry } from 'idly-common/lib/osm/structures';
export declare const DEFAULT_NODE_ICON = "circle";
export declare function nodePropertiesGen(node: Node, parentWays: ParentWays): {
    icon: any;
    name: string;
    geometry: OsmGeometry;
};
export declare const applyNodeMarkup: (geometry: NodeGeometry, tags: Map<string, string>) => {
    icon: any;
    name: string;
    geometry: OsmGeometry;
};
