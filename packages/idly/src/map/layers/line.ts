import { fromJS } from 'immutable';
import * as React from 'react';

import { Entities } from 'osm/entities/entities';

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

export class LineLayer extends React.PureComponent<IPropsType, IStatesType> {
  static displayName = 'LineLayer';
  static selectable = true;
  state = {
    layerSpec: LayerSpec({
      id: this.props.name,
      type: 'line',
      source: this.props.sourceName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#eee',
        'line-width': 2
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
