import { fromJS } from 'immutable';

import { PLUGIN_NAME } from 'map/style';
import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

const displayName = (sourceName: string) => sourceName + 'AreaLayer';

const areaColor = '#551A8B';
export const areaPaintStyle = {
  'line-color': areaColor,
  'line-width': {
    base: 4,
    stops: [[16, 4], [18, 40], [22, 20]]
  },
  'line-opacity': {
    base: 0.2,
    stops: [[16, 0.6], [18, 0.3], [22, 0.4]]
  },
  'line-offset': {
    base: 4,
    stops: [[16, 4], [18, 16], [22, 12]]
  },
  'line-blur': {
    base: 2,
    stops: [[16, 4], [18, 8], [22, 12]]
  }
};

export const AreaLayer = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: 0.1,
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
      filter: fromJS([
        'all',
        ['==', '$type', 'Polygon'],
        /**
         * @REVISIT buildings or any small really look ugly with that gl offset artifact
         *  going for a fill layer for now.
         */
        ['!=', `${PLUGIN_NAME}--tagsClass`, 'tag-building']
      ])
    })
  });

const displayNameC = (sourceName: string) => sourceName + 'AreaLayerCasing';

export const AreaLayerCasing = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayNameC(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: 0.1,
      id: displayNameC(sourceName),
      type: 'line',
      source: sourceName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: areaPaintStyle,
      filter: fromJS([
        'all',
        ['==', '$type', 'Polygon'],
        ['!=', `${PLUGIN_NAME}--tagsClass`, 'tag-building']
      ])
    })
  });
