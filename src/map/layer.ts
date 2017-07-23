import { Set } from 'immutable';
import * as R from 'ramda';
import * as React from 'react';

import { Entities } from 'osm/entities/entities';

interface IPropsType {
  name: string;
  sourceName: string;
  dirtyMapAccess;
  entities: Entities;
  updateSource: (sourceName: string, layerId: string) => void;
}

export class Layer extends React.PureComponent<IPropsType, {}> {
  private style;
  private layerId;
  private layers;
  private hiddenEntites: Entities = Set();
  constructor(props: IPropsType) {
    super(props);
    this.layerId = props.name;
    this.layers = styleFactory(this.layerId, props.sourceName);
    this.addLayer(this.layers);
  }
  componentWillReceiveProps(nextProps) {
    // check for less new entities
    // so you can simply hide them.
    const diffPN = this.props.entities.subtract(nextProps.entities);
    const diffNP = nextProps.entities.subtract(this.props.entities);
    if (diffPN.size > 0 && diffNP.size === 0) {
      console.log('hidding simply at', this.layerId);
      this.hiddenEntites = this.hiddenEntites.union(diffPN);
      this.hideEntities(this.hiddenEntites);
    } else if (diffNP.size > 0) {
      this.hiddenEntites = this.hiddenEntites.clear();
      // else update the entire source
      // it is expensive. Need to think of more ways to
      // avoid this.
      this.props.updateSource(this.props.sourceName, this.layerId);
    }
  }
  hideEntities = (entities: Entities) => {
    this.props.dirtyMapAccess(map => {
      map.setFilter(this.layerId, [
        '!in',
        'id',
        ...entities.map(f => f.id).toArray()
      ]);
    });
  };
  addLayer = layer => {
    this.props.dirtyMapAccess(map => map.addLayer(layer));
  };
  getLayerId = id => {
    return `layer-${id}`;
  };
  render() {
    return null;
  }
}

const styleFactory = (layerId, sourceId) => ({
  id: layerId,
  type: 'circle',
  source: sourceId,
  paint: {
    'circle-radius': 4,
    'circle-color': '#E80C7A',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff'
  },
  filter: ['all']
});
