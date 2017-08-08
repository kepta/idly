import { store } from 'common/store';
import { featToNode } from 'map/utils/featToNode';
import { featToWay } from 'map/utils/featToWay';
import { Entity } from 'osm/entities/entities';
import * as R from 'ramda';

export function featToEntities(feats: any[]) {
  const entities: Entity[] = R.flatten(
    feats
      .map(f => ({
        type: f.type,
        geometry: {
          type: f.type,
          coordinates: f.coordinates
        },
        properties: f.properties
      }))
      .map(f => {
        const id = f.properties.id;
        if (id[0] === 'n') {
          return featToNode(f);
        } else if (id[0] === 'w') {
          const graph = store.getState().core.graph;
          return featToWay(f, graph);
        } else if (id[0] === 'r') {
        }
        throw Error('what !');
      })
  );
  return entities;
}
