import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const blueFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-amenity-swimming_pool',
    'tag-leisure-swimming_pool',
    'tag-natural-water',
    'tag-landuse-aquaculture',
    'tag-landuse-basin',
    'tag-landuse-harbour',
    'tag-landuse-reservoir',
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaBlueLayer',
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#77d3de',
      },
      filter: blueFilter,
    },
  },
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'areaBlueLayerCasing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#77d3de' },
      filter: blueFilter,
    },
  },
];
