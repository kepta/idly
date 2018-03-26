import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { IDLY_NS } from '../../constants';
import { LABEL } from '../priorities';

export default [
  {
    selectable: false,
    priority: LABEL.PLUS_1,
    layer: {
      id: 'label-highway',
      type: 'symbol',
      source: undefined,
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 400,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-field': `{${IDLY_NS}name}`, // part 2 of this is how to do it
        'text-size': 12,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-optional': true,
        'text-allow-overlap': false,
      },
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 3.5,
        'text-halo-blur': 0.3,
      },
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', `${IDLY_NS}geometry`, OsmGeometry.LINE],
      ],
    },
  },
];
