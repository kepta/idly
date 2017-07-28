import { Point } from 'geojson';
import { Node } from 'osm/entities/node';
import { ITags } from 'osm/others/tags';
import * as turf from 'turf';
import { weakCache } from 'utils/weakCache';

interface INodeProperties {
  node_properties: string;
  tags: string;
  id: string;
}

export type NodeFeature = GeoJSON.Feature<Point>;

function _nodeToFeat(n: Node): GeoJSON.Feature<Point> {
  if (n instanceof Node) {
    const feat = turf.point([n.loc.lon, n.loc.lat], {
      node_properties: JSON.stringify(n.properties),
      tags: JSON.stringify(n.tags),
      id: n.id
    });
    feat.id = n.id;
    return feat;
  }
}

export const nodeToFeat = weakCache(_nodeToFeat);
