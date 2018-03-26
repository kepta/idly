import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import {
  highwayCaseTemplate,
  highwayTemplate,
  makeLineWidth,
} from './highway.template';

const filter = [
  'all',
  ['in', `${IDLY_NS}tag-highway`, 'tag-highway-service'],
  ['has', `${IDLY_NS}tag-service`],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.PLUS_1,
    layer: {
      id: 'highway-service',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#dcd9b9',
        'line-width': makeLineWidth(0.7),
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highway-service-casing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
        'line-width': makeLineWidth(0.9),
      },
      filter,
    },
  },
];
