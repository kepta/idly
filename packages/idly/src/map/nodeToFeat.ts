import { Node } from 'osm/entities/node';
import * as turf from 'turf';

export function nodeToFeat(n: Node) {
  if (n instanceof Node) {
    const feat = turf.point([n.loc.lon, n.loc.lat], { id: n.id });
    feat.id = n.id;
    return feat;
  }
}
