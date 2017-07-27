import { Set } from 'immutable';
import * as R from 'ramda';
import * as React from 'react';

import { Entities } from 'new/coreOperations';

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
    this.props.dirtyMapAccess(map => {
      map.on('mouseenter', this.layerId, e => {
        // Change the cursor style as a UI indicator.
        const bbox = [
          [e.point.x - 4, e.point.y - 4],
          [e.point.x + 4, e.point.y + 4]
        ];
        if (map.queryRenderedFeatures(bbox, this.layerId).length > 0) {
          map.getCanvas().style.cursor = 'pointer';
        }
      });
      map.on('mouseleave', this.layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log(
      'layer receive props',
      this.props.name,
      nextProps.entities.size
    );
    // check for less new entities
    // so you can simply hide them.
    const removedEntities = this.props.entities.subtract(nextProps.entities);
    const addedEntites = nextProps.entities.subtract(this.props.entities);
    if (removedEntities.size > 0 && addedEntites.size === 0) {
      console.log(
        'hidding simply at',
        this.layerId,
        'removed entities',
        removedEntities.toJS()
      );
      this.hiddenEntites = this.hiddenEntites.union(removedEntities);
      this.hideEntities(this.hiddenEntites);
    } else if (addedEntites.size > 0) {
      console.log(
        'doing full reload, addedEntites=',
        addedEntites,
        ' at',
        this.layerId,
        'removed=',
        removedEntities
      );
      this.hiddenEntites = this.hiddenEntites.clear();
      this.clearFilter();
      // else update the entire source
      // it is expensive. Need to think of more ways to
      // avoid this.
      this.props.updateSource(this.props.sourceName, this.layerId);
    }
  }
  clearFilter = () => {
    this.props.dirtyMapAccess(map => {
      map.setFilter(this.layerId, ['all']);
    });
  };
  hideEntities = (entities: Entities) => {
    this.props.dirtyMapAccess(map => {
      console.log(
        'hiding these',
        entities.map(e => e.id).toArray(),
        'at',
        this.layerId
      );
      map.setFilter(this.layerId, [
        '!in',
        'id',
        ...entities.map(e => e.id).toArray()
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
