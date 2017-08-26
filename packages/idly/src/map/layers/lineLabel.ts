import { fromJS, Set as $Set } from 'immutable';

import { ILayerSpec, LayerSpec } from 'map/utils/layerFactory';
import { simpleLayerHOC } from 'map/utils/simpleLayer.hoc';

/**
 * @REVISIT fix this
 */

interface IPropsType {
  sourceName: string;
  entities: $Set<any>;
  updateLayer: (layerSpec: ILayerSpec) => void;
}

interface IStatesType {
  layerSpec: ILayerSpec;
}

const displayName = (sourceName: string) => sourceName + 'LineLabelLayer';

export const LineLabelLayer = (sourceName: string) =>
  simpleLayerHOC({
    displayName: displayName(sourceName),
    selectable: false,
    layer: LayerSpec({
      priority: 5,
      id: displayName(sourceName),
      type: 'symbol',
      source: sourceName,
      layout: {
        'symbol-placement': 'line',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-field': '{name}', // part 2 of this is how to do it
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
      filter: fromJS(['all', ['==', '$type', 'LineString']])
    })
  });
