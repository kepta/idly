import { fromJS } from 'immutable';

import { areaPaintStyle } from '../../layers/area';
import { PLUGIN_NAME } from '../../constants';
import { addSource } from '../../helper/addSource';

const filter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${PLUGIN_NAME}--tagsClassType`,
    'tag-amenity-swimming_pool',
    'tag-leisure-swimming_pool',
    'tag-natural-water',
    'tag-landuse-aquaculture',
    'tag-landuse-basin',
    'tag-landuse-harbour',
    'tag-landuse-reservoir'
  ]
];

const blueLayer = {
  id: 'areaBlueLayer',
  type: 'line',
  source: undefined,
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#77d3de',
    'line-width': 2,
    'line-opacity': 1
  },
  filter
};

const blueLayerCasing = {
  id: 'areaBlueLayerCasing',
  type: 'line',
  source: undefined,
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: { ...areaPaintStyle, 'line-color': '#77d3de' },
  filter
};

export const areaBlueLayer = (sourceName: string) =>
  fromJS({
    selectable: false,
    priority: 1,
    layer: addSource(blueLayer, sourceName)
  });

export const areaBlueLayerCasing = (sourceName: string) =>
  fromJS({
    selectable: false,
    priority: 1,
    layer: addSource(blueLayerCasing, sourceName)
  });
