import { fromJS } from 'immutable';
import * as React from 'react';

import { Entities } from 'osm/entities/entities';

import { hideEntities } from 'map/utils/hideEntities';
import { ILayerSpec, LayerSpec } from 'map/utils/layerFactory';
import { SymbolLayout, SymbolPaint } from 'mapbox-gl';
import { Geometry } from 'osm/entities/constants';

interface IPropsType {
  name: string;
  sourceName: string;
  entities: Entities;
  updateLayer: (layerSpec: ILayerSpec) => void;
}

interface IStatesType {
  layerSpec: ILayerSpec;
}

export class PointsWithLabels extends React.PureComponent<
  IPropsType,
  IStatesType
> {
  static displayName = 'PointsWithLabels';
  static selectable = true;
  state = {
    layerSpec: LayerSpec({
      id: this.props.name,
      type: 'symbol',
      source: this.props.sourceName,
      layout: {
        'icon-image': '{icon}-11',
        'icon-allow-overlap': true,
        'text-field': '{name}',
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 9,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.05,
        'text-offset': [0, 1.5],
        'text-optional': true,
        'text-anchor': 'top',
        'text-allow-overlap': false
      } as SymbolLayout,
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5
      } as SymbolPaint,
      filter: fromJS([
        'all',
        ['has', 'icon'],
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
