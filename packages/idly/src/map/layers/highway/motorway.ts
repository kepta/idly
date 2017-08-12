import { fromJS, Map } from 'immutable';

import { LayerSpec, partialLayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

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
        'line-width': {
          base: 1.2,
          stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
        }
      },
      filter: fromJS([
        'all',
        [
          'in',
          'tagsClassType',
          'tag-highway-motorway',
          /**
           * @TOFIX iD uses a mix of x_link and x-link.
           */
          'tag-highway-motorway_link'
        ]
      ])
    })
  });

const displayNameC = (sourceName: string) =>
  sourceName + 'highwayMotorwayCasing';

export const highwayMotorwayCasing = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayNameC(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: -2,
      id: displayNameC(sourceName),
      type: 'line',
      source: sourceName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#70372f',
        'line-opacity': 1,
        'line-width': {
          base: 2.2,
          stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
        }
      },
      filter: fromJS([
        'all',
        [
          'in',
          'tagsClassType',
          'tag-highway-motorway',
          'tag-highway-motorway_link'
        ]
      ])
    })
  });
