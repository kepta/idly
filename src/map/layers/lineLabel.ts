import { fromJS } from 'immutable';
import * as React from 'react';

import { Entities } from 'osm/entities/entities';

import { LineLayer } from 'map/layers/line';
import { hideEntities } from 'map/utils/hideEntities';
import { ILayerSpec, LayerSpec } from 'map/utils/layerFactory';

/**
 * @REVISIT fix this
 */

interface IPropsType {
  name: string;
  sourceName: string;
  entities: Entities;
  updateLayer: (layerSpec: ILayerSpec) => void;
}

interface IStatesType {
  layerSpec: ILayerSpec;
}

export class LineLabelLayer extends React.PureComponent<
  IPropsType,
  IStatesType
> {
  static displayName = 'LineLabelLayer';
  static selectable = true;
  state = {
    layerSpec: LayerSpec({
      id: this.props.name,
      type: 'symbol',
      source: this.props.sourceName,
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
  };
  shouldComponentUpdate(nextProps, nextState: IStatesType) {
    return !this.state.layerSpec.equals(nextState.layerSpec);
  }
  componentWillReceiveProps(nextProps: IPropsType) {
    const layerSpec = hideEntities(
      this.state.layerSpec,
      this.props.entities,
      nextProps.entities
    );
    this.setState({
      layerSpec
    });
  }
  render() {
    this.props.updateLayer(this.state.layerSpec);
    return null;
  }
}
