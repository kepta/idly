import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import { highwayCaseTemplate, highwayTemplate } from './highway.template';
const filter = [
  'all',
  [
    'in',
    `${IDLY_NS}tagsClassType`,
    'tag-highway-residential',
    'tag-highway-residential_link',
    'tag-highway-service',
  ],
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highwayResidential',
      type: 'line',
      source: undefined,
      layout: highwayTemplate.layer.layout,
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#FFF',
      },
      filter,
    },
  },

  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highwayResidentialCasing',
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
