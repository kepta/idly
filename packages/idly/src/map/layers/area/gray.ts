import { fromJS } from 'immutable';

import { areaPaintStyle } from 'map/layers/area';
import { PLUGIN_NAME } from 'map/style';
import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

const displayName = (sourceName: string) => sourceName + 'areaGrayLayer';

const areaColor = '#bbb';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}.tagsClassType`,
    'tag-amenity-parking',
    'tag-leisure-pitch.tag-sport-basketball',
    'tag-leisure-pitch.tag-sport-skateboard',
    'tag-natural-bare_rock',
    'tag-natural-scree',
    'tag-landuse-railway',
    'tag-landuse-quarry',
    'tag-natural-cave_entrance',
    'tag-natural-glacier'
  ]
]);

export const areaGrayLayer = (sourceName: string) =>
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

const displayNameC = (sourceName: string) => sourceName + 'areaGrayLayerCasing';

export const areaGrayLayerCasing = (sourceName: string) =>
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
