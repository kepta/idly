import { fromJS, Set as $Set } from 'immutable';

import { PLUGIN_NAME } from 'map/style';
import { IfromJS, fromJS } from 'map/utils/layerFactory';

/**
 * @REVISIT fix this
 */

interface IPropsType {
  sourceName: string;
  entities: $Set<any>;
  updateLayer: (fromJS: IfromJS) => void;
}

interface IStatesType {
  fromJS: IfromJS;
}

const displayName = (sourceName: string) => sourceName + 'AreaLabelsLayer';

export const AreaLabelsLayer = (sourceName: string) => ({
  displayName: displayName(sourceName),
  selectable: false,
  layer: fromJS({
    priority: 5,
    id: displayName(sourceName),
    type: 'symbol',
    source: sourceName,
    layout: {
      'symbol-placement': 'point',
      'icon-image': `{${PLUGIN_NAME}--icon}-12`,
      'icon-allow-overlap': true,
      'icon-offset': [0, 2],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-field': `{${PLUGIN_NAME}--name}`, // part 2 of this is how to do it
      'text-size': 9,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.05,
      'text-optional': true,
      'text-allow-overlap': false
    },
    paint: {
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5
    },
    filter: fromJS(['all', ['==', '$type', 'Polygon']])
  })
});
