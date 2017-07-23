import { Entities } from 'osm/entities/entities';

import { nodeToFeat } from 'map/nodeToFeat';

const nodeFilter = (entities: Entities): Entities =>
  entities.filter(f => f instanceof Node) as Entities;

export function source(entities: Entities, sourceId: string) {
  const nodes = nodeFilter(entities);
  return {
    layers: [nodeLayer(layerFactory(nodes, sourceId, '1'))]
  };
}
interface ILayerType {
  style: any;
  entities: Entities;
  filter: any[];
}
export function layerFactory(
  entities: Entities,
  sourceId: string,
  layerId: string
): ILayerType {
  return {
    style: styleFactory(sourceId, layerId),
    filter: [],
    entities
  };
}

export function appendFilter(filter: string[], layer: ILayerType): ILayerType {
  return {
    ...layer,
    style: {
      ...layer.style,
      filter: [...layer.style.filter, filter]
    }
  };
}

export function nodeLayer(
  layer: ILayerType,
  hiddenEntities: Entities
): ILayerType {
  const filter = ['==', 'type', 'node'];
  const filter2 = ['!in', 'id', ...hiddenEntities.map(f => f.id).toArray()];
  return appendFilter(filter2, appendFilter(filter, layer));
}

const styleFactory = (sourceId, layerId) => ({
  id: layerId,
  type: 'circle',
  source: sourceId,
  paint: {
    'circle-radius': 4,
    'circle-color': '#E80C7A',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff'
  },
  filter: ['all']
});
