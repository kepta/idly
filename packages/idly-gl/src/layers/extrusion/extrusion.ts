import { IDLY_NS } from '../../constants';
import { EXTRUSION } from '../priorities';

export default [
  {
    selectable: false,
    hide: true,
    priority: EXTRUSION.ZERO,
    layer: {
      id: 'extrusionExtrusion',
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
        'fill-extrusion-opacity': 0.7,
      },
      filter: [
        'all',
        ['==', `${IDLY_NS}geometry`, 'area'],
        ['has', `${IDLY_NS}height`],
      ],
    },
  },
];
