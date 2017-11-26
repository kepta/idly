import { fromJS } from 'immutable';

import { areaPaintStyle } from 'map/layers/area';
import { PLUGIN_NAME } from 'map/style';
import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

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

export const areaGoldLayer = (sourceName: string) =>
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

const displayNameC = (sourceName: string) => sourceName + 'areaGoldLayerCasing';

export const areaGoldLayerCasing = (sourceName: string) =>
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
