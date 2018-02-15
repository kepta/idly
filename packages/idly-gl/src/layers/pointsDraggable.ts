import { PLUGIN_NAME } from '../constants';

export default [
  {
    selectable: true,
    priority: 9.99,
    layer: {
      minzoom: 18.5,
      id: 'PointsDragableLayer',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 3,
        'circle-color': '#EAB4E9',
      },
      filter: [
        'all',
        // ['!has', `${PLUGIN_NAME}--icon`],
        // ['==', '$type', 'Point'],
        // /**
        //  * @REVISIT this vertex problem
        //  */
        // ['!in', `${PLUGIN_NAME}--geometry`, 'vertex'] // OsmGeometry.VERTEX
      ],
    },
  },
  {
    selectable: true,
    priority: 9,
    layer: {
      minzoom: 18.5,
      id: 'PointsDragableStrokeLayer',
      source: undefined,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 4,
        'circle-color': '#fff',
        'circle-stroke-width': 1,
      },
      filter: [
        'all',
        // ['!has', `${PLUGIN_NAME}--icon`],
        // ['==', '$type', 'Point'],
        // /**
        //  * @REVISIT this vertex problem
        //  */
        // ['!in', `${PLUGIN_NAME}--geometry`, 'vertex'] // OsmGeometry.VERTEX
      ],
    },
  },
];
