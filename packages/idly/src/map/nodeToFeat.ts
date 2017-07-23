import { Node } from 'osm/entities/node';
import * as turf from 'turf';
const Cache = new WeakMap();
export function nodeToFeat(n: Node) {
  if (n instanceof Node) {
    if (Cache.has(n)) return Cache.get(n);
    const feat = turf.point([n.loc.lon, n.loc.lat], {
      id: n.id,
      type: n.type,
      ...n.properties
    });
    feat.id = n.id;
    Cache.set(n, feat);
    return feat;
  }
}
