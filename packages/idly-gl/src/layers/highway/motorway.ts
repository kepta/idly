import { IDLY_NS } from '../../constants';
import { highwayTemplate, highwayCaseTemplate } from './highway.template';
import { HIGHWAY } from '../priorities';

const filter = [
  'all',
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-highway-motorway',
    /**
     * @TOFIX iD uses a mix of x_link and x-link.
     */
    'tag-highway-motorway_link',
  ],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highwayMotorway',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#CF2081',
      },
      filter,
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highwayMotorwayCasing',
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
