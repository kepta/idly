import { Set } from 'immutable';
import * as React from 'react';

import { Entities, Entity } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';

import { setSubtractNode } from 'map/utils/setSubtract';
import { FillPaint, Layer } from 'mapbox-gl';

/**
 * @REVISIT fix this
 */

interface IPropsType {
  name: string;
  sourceName: string;
  dirtyMapAccess;
  entities: Entities;
  updateSource: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
}
interface IStatesType {
  toRemove: Entities;
}
export class FillLayer extends React.PureComponent<IPropsType, IStatesType> {
  static displayName = 'FillLayer';
  static selectable = false;
  state = {
    toRemove: Set<Entity>()
  };
  baseFilter = ['all', ['==', '$type', 'Polygon']];
  addLayer = (layer: Layer) => {
    this.props.dirtyMapAccess(map => map.addLayer(layer));
  };
  componentDidMount() {
    this.addLayer({
      id: this.props.name,
      type: 'fill',
      source: this.props.sourceName,
      paint: {
        'fill-opacity': 0.05,
        'fill-color': '#06feff',
        'fill-outline-color': '#d6feff'
      },
      filter: this.baseFilter
    });
  }
  componentWillReceiveProps(nextProps: IPropsType) {
    const removedEntities = setSubtractNode(
      this.props.entities,
      nextProps.entities
    );
    const addedEntities = setSubtractNode(
      nextProps.entities,
      this.props.entities
    );
    if (removedEntities.size > 0 && addedEntities.size === 0) {
      this.setState({
        toRemove: this.state.toRemove.union(removedEntities) as Entities
      });
    } else if (addedEntities.size > 0) {
      this.props.updateSource(
        nextProps.entities,
        this.props.dirtyMapAccess,
        this.props.sourceName
      );
      this.setState({
        toRemove: this.state.toRemove.clear()
      });
    }
  }
  componentWillUpdate(nextProps, nextState: IStatesType) {
    if (!nextState.toRemove.equals(this.state.toRemove)) {
      this.props.dirtyMapAccess(map => {
        console.log(
          `hiding these ${this.props.name} at ${nextState.toRemove
            .map(e => e.id)
            .toArray()}`
        );
        map.setFilter(this.props.name, [
          ...this.baseFilter,
          ['!in', 'id', ...nextState.toRemove.map(e => e.id).toArray()]
        ]);
      });
    }
  }
  render() {
    return null;
  }
}
