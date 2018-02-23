import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import { highwayCaseTemplate, highwayTemplate } from './highway.template';

const filter = [
  'all',
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-highway-trunk',
    'tag-highway-trunk_link',
  ],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highwayTrunk',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#DD2F22',
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highwayTrunkCasing',
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
