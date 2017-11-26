import { fromJS } from 'immutable';

import { areaPaintStyle } from '../layers/layers/area';
import { PLUGIN_NAME } from '../layers/style';
import { fromJS } from '../layers/utils/layerFactory';

const displayName = (sourceName: string) => sourceName + 'areaGrayLayer';

const areaColor = '#bbb';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
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

export const areaGrayLayer = (sourceName: string) => ({
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

const displayNameC = (sourceName: string) => sourceName + 'areaGrayLayerCasing';

export const areaGrayLayerCasing = (sourceName: string) => ({
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
