import { fromJS } from 'immutable';

import { areaPaintStyle } from '../layers/layers/area';
import { PLUGIN_NAME } from '../layers/style';
import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'areaGoldLayer';

const areaColor = '#c4bd19';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  /**
   * @TOFIX need to figure out for `tagsClass` and let the ``${PLUGIN_NAME}--tagsClassType`` override
   *  based on priority.
   */
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-landuse-residential',
    'tag-landuse-construction'
  ]
]);

export const areaGoldLayer = (sourceName: string) => ({
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

const displayNameC = (sourceName: string) => sourceName + 'areaGoldLayerCasing';

export const areaGoldLayerCasing = (sourceName: string) => ({
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
