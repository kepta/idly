import { fromJS } from 'immutable';

import { LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';
import { PLUGIN_NAME } from 'map/style';

const displayName = (sourceName: string) => sourceName + 'highwayMotorway';

export const highwayMotorway = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: true,
    layer: LayerSpec({
      priority: 2,
      id: displayName(sourceName),
      type: 'line',
      source: sourceName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#CF2081',
        'line-opacity': 1,
        'line-width': 6
      },
      filter: fromJS([
        'all',
        [
          'in',
          `${PLUGIN_NAME}.tagsClassType`,
          'tag-highway-motorway',
          /**
           * @TOFIX iD uses a mix of x_link and x-link.
           */
          'tag-highway-motorway_link'
        ]
      ])
    })
  });
