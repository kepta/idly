import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';
import { Geometry } from 'osm/entities/constants';

const displayName = (sourceName: string) =>
  sourceName + 'PointsWithoutLabelsLayer';

export const PointsWithoutLabelsLayer = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: true,
    layer: LayerSpec({
      minzoom: 17,
      priority: 3,
      id: displayName(sourceName),
      source: sourceName,
      type: 'circle',
      layout: {},
      paint: {
        'circle-radius': 6,
        'circle-color': '#eeeeee',
        'circle-stroke-width': 0.5
      },
      filter: fromJS([
        'all',
        ['!has', 'icon'],
        ['==', '$type', 'Point'],
        /**
         * @REVISIT this vertex problem
         */
        ['!in', 'geometry', Geometry.VERTEX, Geometry.VERTEX_SHARED]
      ])
    })
  });
