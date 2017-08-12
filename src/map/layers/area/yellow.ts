import { fromJS } from 'immutable';

import { areaPaintStyle } from 'map/layers/area';
import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

const displayName = (sourceName: string) => sourceName + 'areaYellowLayer';

const areaColor = '#ffff94';

const filter = fromJS([
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    'tagsClassType',
    'tag-sport-beachvolleyball',
    'tag-natural-beach',
    'tag-natural-sand',
    'tag-natural-scrub',
    'tag-amenity-childcare',
    'tag-amenity-kindergarten',
    'tag-amenity-school',
    'tag-amenity-college',
    'tag-amenity-university'
  ]
]);

export const areaYellowLayer = (sourceName: string) =>
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
  sourceName + 'areaYellowLayerCasing';

export const areaYellowLayerCasing = (sourceName: string) =>
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
