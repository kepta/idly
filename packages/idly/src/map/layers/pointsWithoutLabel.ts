import { fromJS, Set } from 'immutable';
import * as React from 'react';

import { Entities, Entity } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';

import { hideEntities } from 'map/layers/helper/hideEntities';
import { ILayerSpec, LayerSpec } from 'map/layers/layerFactory';
import { setSubtractEntities } from 'map/utils/setSubtract';
import { Layer } from 'mapbox-gl';
import { Geometry } from 'osm/entities/constants';

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

export class PointsWithoutLabels extends React.PureComponent<
  IPropsType,
  IStatesType
> {
  static displayName = 'PointsWithoutLabels';
  static selectable = true;
  state = {
    layerSpec: LayerSpec({
      id: this.props.name,
      type: 'circle',
      source: this.props.sourceName,
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
        ['!=', 'geometry', Geometry.VERTEX]
      ])
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
