import { fromJS } from 'immutable';

import { OsmGeometry } from 'idly-common/lib/osm/structures';
import { PLUGIN_NAME } from 'map/style';
import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

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
        ['!has', `${PLUGIN_NAME}--icon`],
        ['==', '$type', 'Point'],
        /**
         * @REVISIT this vertex problem
         */
        [
          '!in',
          `${PLUGIN_NAME}--geometry`,
          OsmGeometry.VERTEX,
          OsmGeometry.VERTEX_SHARED
        ]
      ])
    })
  });
