import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

const displayName = (sourceName: string) => sourceName + 'areaBuildingLayer';

const areaColor = '#e06e5f';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', 'tagsClassType', 'tag-amenity-shelter'],
    ['==', 'tagsClass', 'tag-building']
  ]
]);

export const areaBuildingLayer = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: false,
    layer: LayerSpec({
      minzoom: 17,
      priority: 2,
      id: displayName(sourceName),
      type: 'line',
      source: sourceName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': areaColor,
        'line-width': 2,
        'line-opacity': 1
      },
      filter
    })
  });

const displayNameC = (sourceName: string) =>
  sourceName + 'areaBuildingLayerFill';

export const areaBuildingLayerFill = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayNameC(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: 1,
      id: displayNameC(sourceName),
      type: 'fill',
      source: sourceName,
      paint: {
        'fill-opacity': 0.2,
        'fill-color': areaColor
      },
      filter
    })
  });
