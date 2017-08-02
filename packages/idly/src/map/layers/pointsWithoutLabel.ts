import { List, Set } from 'immutable';
import * as React from 'react';

import { Entities } from 'core/coreOperations';
import { Node } from 'osm/entities/node';

import { setSubtract } from 'map/utils/setSubtract';
import { Layer } from 'mapbox-gl';

/**
 * @REVISIT fix this
 */
const ss = setSubtract<Node>();

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
  toRemove: Set<Node>;
}
export class PointsWithoutLabels extends React.PureComponent<
  IPropsType,
  IStatesType
> {
  static displayName = 'PointsWithoutLabels';
  state = {
    toRemove: Set<Node>()
  };
  baseFilter = ['all', ['!has', 'name']];
  addLayer = layer => {
    this.props.dirtyMapAccess(map => map.addLayer(layer));
  };
  componentDidMount() {
    this.addLayer({
      id: this.props.name,
      type: 'symbol',
      source: this.props.sourceName,
      layout: {
        'icon-image': '{icon}-15',
        'icon-allow-overlap': true
      },
      filter: this.baseFilter
    });
  }
  componentWillReceiveProps(nextProps: IPropsType) {
    const removedEntities = ss(this.props.entities, nextProps.entities);
    const addedEntites = ss(nextProps.entities, this.props.entities);
    if (removedEntities.size > 0 && addedEntites.size === 0) {
      this.setState({
        toRemove: this.state.toRemove.union(removedEntities) as Set<Node>
      });
    } else if (addedEntites.size > 0) {
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
