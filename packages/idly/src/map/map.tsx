import { Set } from 'immutable';
import * as deb from 'lodash.debounce';
import * as R from 'ramda';
import * as React from 'react';
import * as turf from 'turf';

import { Entities } from 'new/coreOperations';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { IRootStateType, observe, store } from 'store/index';
import { getOSMTiles, updateSources } from 'store/map/actions';
import { lonlatToXYs, mercator } from 'utils/mecarator';

import { Draw } from 'draw/draw';

import { Layer } from 'map/layer';
import { genMapGl, popup } from 'map/mapboxgl_setup';
import { Source } from 'map/source';
import { cache } from 'map/weak_map_cache';
import { connect } from 'react-redux';
import { attachToWindow } from 'utils/attach_to_window';
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
    attachToWindow('map', this.map);

    attachToWindow('popup', () => {
      this.map.on('mouseenter', 'virgin-nodelayer', e => {
        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = 'pointer';
        const bbox = [
          [e.point.x - 5, e.point.y - 5],
          [e.point.x + 5, e.point.y + 5]
        ];
        if (
          this.map.queryRenderedFeatures(bbox, { layers: 'virgin-nodelayer' })
            .length > 0
        ) {
          this.map.getCanvas().style.cursor = 'pointer';
        }
        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(e.features[0].properties.id)
          .addTo(this.map);
      });
      this.map.on('mouseleave', 'virgin-nodelayer', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
    this.map.on('load', () => {
      this.setState({ mapLoaded: true });
    });
    this.map.on('moveend', this.dispatchTiles);
  }
  updateSource = (sourceName, layerName) => {
    console.log('requesting for update', sourceName, layerName);
    if (sourceName === 'modified') {
      return this.props.updateSources(
        this.props.modifedEntities,
        this.dirtyMapAccess,
        sourceName
      );
    }
    return this.props.updateSources(
      this.props.entities,
      this.dirtyMapAccess,
      sourceName
    );
  };
  dispatchTiles = () => {
    if (this.map.getZoom() < ZOOM) return;
    const ltlng = this.map.getBounds();
    const xys = lonlatToXYs(ltlng, ZOOM);
    store.dispatch(getOSMTiles(xys, ZOOM));
  };
  dirtyMapAccess = mapCb => this.state.mapLoaded && mapCb(this.map);
  render() {
    console.log('map rerendering', this.props);
    return (
      <div>
        <div id="map-container" style={{ height: '100vh', width: '100vw' }} />
        {this.state.mapLoaded &&
          <div>
            <Draw
              dirtyMapAccess={this.dirtyMapAccess}
              layers={['virgin-nodelayer', 'modified-nodelayer']}
            />
            <Source sourceName="virgin" dirtyMapAccess={this.dirtyMapAccess}>
              <Layer
                sourceName="virgin"
                name="virgin-nodelayer"
                dirtyMapAccess={this.dirtyMapAccess}
                entities={this.props.entities}
                updateSource={this.updateSource}
              />
            </Source>
            <Source sourceName="modified" dirtyMapAccess={this.dirtyMapAccess}>
              <Layer
                sourceName="modified"
                name="modified-nodelayer"
                dirtyMapAccess={this.dirtyMapAccess}
                entities={this.props.modifedEntities}
                updateSource={this.updateSource}
              />
            </Source>
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
  { updateSources }
)(MapComp);
