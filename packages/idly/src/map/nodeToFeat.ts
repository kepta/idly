import { Point } from 'geojson';
import { Node } from 'osm/entities/node';
import { ITags } from 'osm/others/tags';
import * as turf from 'turf';

interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
}

export type NodeFeature = GeoJSON.Feature<Point, INodeProperties>;
const Cache = new WeakMap();

export function nodeToFeat(n: Node): GeoJSON.Feature<Point, INodeProperties> {
  if (n instanceof Node) {
    if (Cache.has(n)) return Cache.get(n);
    const feat: GeoJSON.Feature<Point, INodeProperties> = turf.point(
      [n.loc.lon, n.loc.lat],
      {
        node_properties: n.properties.toObject(),
        tags: n.tags.toObject(),
        id: n.id
      }
    );
    feat.id = n.id;
    Cache.set(n, feat);
    return feat;
  }
}
