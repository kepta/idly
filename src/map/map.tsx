import { Set } from 'immutable';
import * as deb from 'lodash.debounce';
import * as R from 'ramda';
import * as React from 'react';
import * as turf from 'turf';

import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { IRootStateType, observe, store } from 'store/index';
import { getOSMTiles, hideEntities, updateSources } from 'store/map/actions';
import { lonlatToXYs, mercator } from 'utils/mecarator';

import { Draw } from 'draw/draw';

import { genMapGl } from 'map/mapboxgl_setup';
import { nodeToFeat } from 'map/nodeToFeat';
import { cache } from 'map/weak_map_cache';
import { connect } from 'react-redux';
export const ZOOM = 16;

type Entity = Node | Way | Relation;

/**
 * The job of map module is to handle
 * the rendering of map. It also means
 * all the styling of layers would be done
 * here.
 * The only argument it takes is G(the current snapshot
 * of the graph) and computes the rest
 * in its internal state.
 */

interface IPropsType {
  entities: Entities;
  modifedEntities: Entities;
  updateSources: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
  hideEntities: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
}
class MapComp extends React.PureComponent<IPropsType, {}> {
  static defaultProps = {
    entities: Set()
  };
  state = {
    mapLoaded: false
  };
  private map;
  private features;
  private count = 0;
  private hiddenEntites: Entities = Set();
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.map = genMapGl('map-container');
    this.map.on('load', () => this.setState({ mapLoaded: true }));
    this.map.on('moveend', this.dispatchTiles);
  }
  drawSelectionChange = () => {
    console.log('here');
  };
  componentWillReceiveProps(nextProps: IPropsType) {
    if (!this.state.mapLoaded || this.count === 4) return;
    // this.count++;
    const entities = nextProps.entities;
    this.updateSources(this.props, nextProps);
  }
  updateSources(prevProps: IPropsType, nextProps: IPropsType) {
    if (!prevProps.entities.equals(nextProps.entities)) {
      const diffPN = prevProps.entities.subtract(nextProps.entities);
      const diffNP = nextProps.entities.subtract(prevProps.entities);

      if (diffPN.size > 0 && diffNP.size === 0) {
        console.log('hidding ismply');
        this.hiddenEntites = this.hiddenEntites.union(diffPN);
        this.props.hideEntities(
          this.hiddenEntites,
          this.dirtyMapAccess,
          'entities'
        );
      } else {
        console.log('updating all ');
        this.props.updateSources(
          nextProps.entities,
          this.dirtyMapAccess,
          'entities'
        );
      }
    }
    if (!prevProps.modifedEntities.equals(nextProps.modifedEntities)) {
      this.props.updateSources(
        nextProps.modifedEntities,
        this.dirtyMapAccess,
        'modifedEntities'
      );
    }
  }
  dispatchTiles = () => {
    if (this.map.getZoom() < ZOOM) return;
    const ltlng = this.map.getBounds();
    const xys = lonlatToXYs(ltlng, ZOOM);
    store.dispatch(getOSMTiles(xys, ZOOM));
  };
  dirtyMapAccess = mapCb => this.state.mapLoaded && mapCb(this.map);
  render() {
    return (
      <div>
        <div id="map-container" style={{ height: '100vh', width: '100vw' }} />
        {this.state.mapLoaded &&
          <div>
            <Draw dirtyMapAccess={this.dirtyMapAccess} />
          </div>}
      </div>
    );
  }
}

export const Map = connect<any, any, any>(
  (state: IRootStateType, props) => ({
    entities: state.core.entities,
    modifedEntities: state.core.modifedEntities
  }),
  { updateSources, hideEntities }
)(MapComp);
