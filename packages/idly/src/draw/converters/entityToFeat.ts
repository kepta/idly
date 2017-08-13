import { store } from 'common/store';

// import { nodeToFeat } from 'map/utils/nodeToFeat';
// import { wayToFeat } from 'map/utils/wayToFeat';
//
import { nodeCombiner } from 'map/highPerf/node';
import { wayCombiner } from 'map/highPerf/way';
import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Way } from 'osm/entities/way';

export function entityToFeat(entities: Entities) {
  const core = store.getState().core;

  const feat = entities.map(e => {
    if (e instanceof Node) return nodeCombiner(e, core.parentWays);
    if (e instanceof Way) {
      return wayCombiner(e, core.graph);
    }
  });
  return feat.toArray();
}
