import { IDLY_NS } from '../../constants';
import { NON_INTERACTIVE } from '../priorities';

export default [
  {
    selectable: false,
    priority: NON_INTERACTIVE.ZERO,
    layer: {
      id: 'nonInteractiveExtrusion',
      type: 'fill-extrusion',
      source: undefined,
      paint: {
        // See the Mapbox Style Specification for details on data expressions.
        // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions

        // Get the fill-extrusion-color from the source 'color' property.
        'fill-extrusion-color': '#e06e5f',

        // Get fill-extrusion-height from the source 'height' property.
        'fill-extrusion-height': ['get', `${IDLY_NS}height`],

        'fill-extrusion-base': ['get', `${IDLY_NS}min_height`],
        // Get fill-extrusion-base from the source 'base_height' property.

        // Make extrusions slightly opaque for see through indoor walls.
        'fill-extrusion-opacity': 0.9,
      },
      filter: [
        'all',
        ['==', `${IDLY_NS}geometry`, 'area'],
        ['has', `${IDLY_NS}height`],
      ],
    },
  },
];
