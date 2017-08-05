import * as React from 'react';
import * as turf from 'turf';

import { Entities } from 'osm/entities/entities';

interface IPropsType {
  sourceName: string;
  dirtyMapAccess;
  updateSource: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
  entities: Entities;
}

export class Source extends React.PureComponent<IPropsType, {}> {
  state = {
    sourceLoaded: false
  };
  shouldComponentUpdate(nextProps: IPropsType, nextState) {
    return (
      !nextProps.entities.equals(this.props.entities) ||
      this.state.sourceLoaded !== nextState.sourceLoaded
    );
  }
  componentDidMount() {
    this.props.dirtyMapAccess(map => {
      map.addSource(this.props.sourceName, {
        type: 'geojson',
        data: turf.featureCollection([])
      });
      // might want to check back on this
      this.setState({ sourceLoaded: true });
    });
  }
  render() {
    if (this.state.sourceLoaded) {
      return (
        <span>
          {this.props.children}
        </span>
      );
    }
    return null;
  }
}
