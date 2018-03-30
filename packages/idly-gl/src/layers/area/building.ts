import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaTemplate } from './area.template';

export const buildingFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${IDLY_NS}tag-amenity`, 'tag-amenity-shelter'],
    ['has', `${IDLY_NS}tag-building`],
  ],
];

export default [
  {
    selectable: true,
    priority: AREA.PLUS_1,
    layer: {
      id: 'area-building',
      minzoom: 17,
      type: 'line',
      source: undefined,
      layout: areaTemplate.layer.layout,
      paint: {
        ...areaTemplate.layer.paint,
        'line-color': '#e06e5f',
      },
      filter: buildingFilter,
    },
  },
  {
    selectable: true,
    priority: AREA.PLUS_1,
    layer: {
      id: 'area-building-fill',
      type: 'fill',
      source: undefined,
      paint: {
        'fill-opacity': 0.2,
        'fill-color': '#e06e5f',
      },
      filter: buildingFilter,
    },
  },
];
