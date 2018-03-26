import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import {
  highwayCaseTemplate,
  highwayTemplate,
  makeLineWidth,
} from './highway.template';
const filter = [
  'all',
  [
    'in',
    `${IDLY_NS}tag-highway`,
    'tag-highway-secondary',
    'tag-highway-secondary_link',
  ],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highway-secondary',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#F3F312',
        'line-width': makeLineWidth(0.8),
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highway-secondary-casing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
        'line-width': makeLineWidth(1),
      },
      filter,
    },
  },
];
