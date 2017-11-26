// tag-landuse-farmyard

import { fromJS } from 'immutable';

import { areaPaintStyle } from '../layers/layers/area';
import { PLUGIN_NAME } from '../layers/style';
import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'areaTanLayer';

const areaColor = '#f5dcba';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  ['in', `${PLUGIN_NAME}--tagsClassType`, 'tag-landuse-farmyard']
]);

export const areaTanLayer = (sourceName: string) => ({
  displayName: displayName(sourceName),
  selectable: false,
  layer: fromJS({
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

const displayNameC = (sourceName: string) => sourceName + 'areaTanLayerCasing';

export const areaTanLayerCasing = (sourceName: string) => ({
  displayName: displayNameC(sourceName),
  selectable: false,
  layer: fromJS({
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
