import { store } from 'common/store';

import { nodeToFeat } from 'map/utils/nodeToFeat';
import { wayToFeat } from 'map/utils/wayToFeat';

import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Way } from 'osm/entities/way';

export function entityToFeat(entities: Entities) {
  const feat = entities.map(e => {
    if (e instanceof Node) return nodeToFeat(e);
    if (e instanceof Way) {
      const graph = store.getState().core.graph;
      return wayToFeat(e, graph);
    }
  });
  return feat.toArray();
}
