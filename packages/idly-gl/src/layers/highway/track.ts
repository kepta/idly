import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import {
  highwayCaseTemplate,
  highwayTemplate,
  makeLineWidth,
} from './highway.template';

const filter = ['all', ['in', `${IDLY_NS}tag-highway`, 'tag-highway-track']];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highway-track',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#c5b59f',
        'line-width': makeLineWidth(0.4),
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highway-track-casing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
        'line-width': makeLineWidth(0.55),
      },
      filter,
    },
  },
];
