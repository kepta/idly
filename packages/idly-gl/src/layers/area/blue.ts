import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaCasingTemplate, areaTemplate } from './area.template';

export const blueLanduse = [
  'tag-landuse-aquaculture',
  'tag-landuse-basin',
  'tag-landuse-harbour',
  'tag-landuse-reservoir',
];
// natural water pond http://localhost:8080/#21.58/40.7216128/-73.9894839
export const blueNatural = ['tag-natural-water'];
export const blueFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${IDLY_NS}tag-amenity`, 'tag-amenity-swimming_pool'],
    ['==', `${IDLY_NS}tag-leisure`, 'tag-amenity-swimming_pool'],
    ['==', `${IDLY_NS}tag-natural`, blueNatural[0]],
    ['in', `${IDLY_NS}tag-landuse`, ...blueLanduse],
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.ZERO,
    layer: {
      id: 'area-blue-layer',
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
      id: 'area-blue-layer-casing',
      type: 'line',
      source: undefined,
      layout: areaCasingTemplate.layer.layout,
      paint: { ...areaCasingTemplate.layer.paint, 'line-color': '#77d3de' },
      filter: blueFilter,
    },
  },
];
