import { Feature, Point } from 'geojson';
import { ParentWays } from 'parsing/parser';
import { Geometry } from 'structs/geometry';
import { Node } from 'structs/node';
export declare const DEFAULT_NODE_ICON = "circle";
export declare function nodeCombiner(node: Node, parentWays: ParentWays): {
    properties: {
        id: string;
        icon: any;
        name: string;
        geometry: Geometry;
    };
    type: "Feature";
    geometry: Point;
    id?: string;
    bbox?: number[];
    crs?: GeoJSON.CoordinateReferenceSystem;
};
export declare const nodeToPoint: (node: Node) => Feature<Point>;
export declare const applyNodeMarkup: (geometry: Geometry.POINT | Geometry.VERTEX | Geometry.VERTEX_SHARED, tags: Map<string, string>) => {
    icon: any;
    name: string;
    geometry: Geometry;
};
