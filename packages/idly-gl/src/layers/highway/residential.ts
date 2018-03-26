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
    'tag-highway-residential',
    'tag-highway-residential_link',
    'tag-highway-service',
  ],
  ['!has', `${IDLY_NS}tag-service`],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highway-residential',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#FFF',
        'line-width': makeLineWidth(0.8),
      },
      filter,
    },
  },

  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highway-residential-casing',
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
