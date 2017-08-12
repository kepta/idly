import { fromJS } from 'immutable';

import { areaPaintStyle } from 'map/layers/area';
import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

const displayName = (sourceName: string) => sourceName + 'areaLightGreenLayer';

const areaColor = '#c7d3a0';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    'tagsClassType',
    'tag-landuse-cemetery',
    'tag-landuse-orchard',
    'tag-landuse-meadow',
    'tag-landuse-farm',
    'tag-landuse-farmland'
  ]
]);

export const areaLightGreenLayer = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: 1,
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
  sourceName + 'areaLightGreenLayerCasing';

export const areaLightGreenLayerCasing = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayNameC(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: 1,
      id: displayNameC(sourceName),
      type: 'line',
      source: sourceName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: { ...areaPaintStyle, 'line-color': areaColor },
      filter
    })
  });
