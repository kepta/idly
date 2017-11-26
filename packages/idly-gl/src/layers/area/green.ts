import { fromJS } from 'immutable';

import { areaPaintStyle } from '../layers/layers/area';
import { PLUGIN_NAME } from '../layers/style';
import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'areaGreenLayer';

const areaColor = '#8cd05f';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    /**
     * @TOFIX doesnt work for a way, I guess a !area, with tag natural=coastline
     */
    ['in', `${PLUGIN_NAME}--tagsClass`, 'tag-natural', 'tag-landuse'],
    [
      'in',
      `${PLUGIN_NAME}--tagsClassType`,
      'tag-leisure-nature_reserve',
      'tag-leisure-pitch',
      'tag-leisure-park',
      'tag-landuse-forest',
      'tag-natural-wetland'
    ]
  ]
]);

export const areaGreenLayer = (sourceName: string) => ({
  displayName: displayName(sourceName),
  selectable: false,
  layer: fromJS({
    /**
     * @TOFIX due to tag-landuse .
     *  need to standardized priority
     */

    priority: 0.9,
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
  sourceName + 'areaGreenLayerCasing';

export const areaGreenLayerCasing = (sourceName: string) => ({
  displayName: displayNameC(sourceName),
  selectable: false,
  layer: fromJS({
    priority: 0.9,
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
