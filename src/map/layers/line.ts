import { fromJS, Set } from 'immutable';
import { Layer } from 'mapbox-gl';
import * as React from 'react';

import { Entities, Entity } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';

import { hideEntities } from 'map/layers/helper/hideEntities';
import { ILayerSpec, LayerSpec } from 'map/layers/layerFactory';
import { setSubtractEntities } from 'map/utils/setSubtract';

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
