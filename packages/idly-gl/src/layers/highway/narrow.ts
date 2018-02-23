import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import { highwayCaseTemplate, highwayTemplate } from './highway.template';
const filter = [
  'all',
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-highway-path',
    'tag-highway-footway',
    'tag-highway-bridleway',
    'tag-highway-cycleway',
  ],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highwayNarrow',
      type: 'line',
      source: undefined,
      layout: {
        ...highwayTemplate.layer.layout,
        'line-cap': 'square',
      },
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#c5b59f',
        'line-dasharray': [1, 1],
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highwayNarrowCasing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
      },
      filter,
    },
  },
];
