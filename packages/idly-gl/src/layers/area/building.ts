import { IDLY_NS } from '../../constants';
import { AREA } from '../priorities';
import { areaTemplate } from './area.template';

export const buildingFilter = [
  'all',
  ['==', '$type', 'Polygon'],
  [
    'any',
    ['==', `${IDLY_NS}tagsClassType`, 'tag-amenity-shelter'],
    ['==', `${IDLY_NS}tagsClass`, 'tag-building'],
  ],
];

export default [
  {
    selectable: false,
    priority: AREA.PLUS_1,
    layer: {
      id: 'areaBuildingLayer',
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
    selectable: false,
    priority: AREA.PLUS_1,
    layer: {
      id: 'areaBuildingLayerFill',
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
