import { fromJS, Set } from 'immutable';
import * as React from 'react';

import { Entities, Entity } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';

import { hideEntities } from 'map/layers/helper/hideEntities';
import { ILayerSpec, LayerSpec } from 'map/layers/layerFactory';
import { setSubtractEntities } from 'map/utils/setSubtract';
import { FillPaint, Layer } from 'mapbox-gl';

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

export class FillLayer extends React.PureComponent<IPropsType, IStatesType> {
  static displayName = 'FillLayer';
  static selectable = false;
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
        'line-color': '#551A8B',
        'line-width': 5,
        'line-opacity': 0.7,
        'line-dasharray': [1, 2, 1, 3, 1, 2, 1]
      },
      filter: fromJS(['all', ['==', '$type', 'Polygon']])
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
