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
export class PointsWithLabels extends React.PureComponent<
  IPropsType,
  IStatesType
> {
  static displayName = 'PointsWithLabels';
  state = {
    toRemove: Set<Node>()
  };
  baseFilter = ['all', ['has', 'name']];
  addLayer = (layer: Layer) => {
    this.props.dirtyMapAccess(map => map.addLayer(layer));
  };
  componentDidMount() {
    this.addLayer({
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
      },
      paint: {
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5,
        'text-halo-blur': 0.5
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
