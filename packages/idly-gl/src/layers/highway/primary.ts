import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import { highwayCaseTemplate, highwayTemplate } from './highway.template';
const filter = [
  'all',
  [
    'in',
    `${IDLY_NS}tag-highway`,
    'tag-highway-primary',
    'tag-highway-primary_link',
  ],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highway-primary',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#F99806',
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highway-primary-casing',
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
