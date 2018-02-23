import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import { highwayCaseTemplate, highwayTemplate } from './highway.template';

const filter = ['all', ['in', `${IDLY_NS}tagsClassType`, 'tag-highway-track']];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highwayTrack',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#c5b59f',
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highwayTrackCasing',
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
