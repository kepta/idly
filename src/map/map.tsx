import { Set } from 'immutable';
import * as MapboxInspect from 'mapbox-gl-inspect';
import * as React from 'react';
import { connect } from 'react-redux';

import { Entities } from 'core/coreOperations';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { IRootStateType } from 'common/store';

import { attachToWindow } from 'utils/attach_to_window';
import { lonlatToXYs } from 'utils/mecarator';

import { Draw } from 'draw/draw';

import { Layer } from 'map/layers/points';
import { mapboxglSetup } from 'map/mapboxglSetup';
import { Source } from 'map/source';
import { getOSMTiles, updateSource } from 'map/store/map.actions';
import { dirtyPopup } from 'map/utils/map.popup';

export const ZOOM = 16;
export const SOURCES = [
  {
    source: 'virgin',
    layer: 'virgin-nodelayer',
    data: 'entities'
  },
  {
    source: 'modified',
    layer: 'modified-nodelayer',
    data: 'modifedEntities'
  }
];
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
  updateSource: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
  getOSMTiles: (xys: number[][], zoom: number) => void;
}

class MapComp extends React.PureComponent<IPropsType, {}> {
  static defaultProps = {
    entities: Set()
  };
  state = {
    mapLoaded: false
  };
  private map;
  componentDidMount() {
    this.map = mapboxglSetup('map-container');
    attachToWindow('map', this.map);

    attachToWindow('popup', () => dirtyPopup(this.map));
    attachToWindow('MapboxInspect', MapboxInspect);

    this.map.on('load', () => {
      this.setState({ mapLoaded: true });
    });
    this.map.on('moveend', this.dispatchTiles);
  }
  dispatchTiles = () => {
    if (this.map.getZoom() < ZOOM) return;
    const ltlng = this.map.getBounds();
    const xys = lonlatToXYs(ltlng, ZOOM);
    this.props.getOSMTiles(xys, ZOOM);
  };
  dirtyMapAccess = mapCb => this.state.mapLoaded && mapCb(this.map);
  render() {
    return (
      <div>
        <div id="map-container" style={{ height: '100vh', width: '100vw' }} />
        {this.state.mapLoaded &&
          <div>
            <Draw
              dirtyMapAccess={this.dirtyMapAccess}
              layers={SOURCES.map(s => s.layer)}
            />
            {SOURCES.map((s, k) =>
              <Source
                key={k}
                sourceName={s.source}
                dirtyMapAccess={this.dirtyMapAccess}
              >
                <Layer
                  sourceName={s.source}
                  name={s.layer}
                  dirtyMapAccess={this.dirtyMapAccess}
                  entities={this.props[s.data]}
                  updateSource={this.props.updateSource}
                />
              </Source>
            )}
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
  { updateSource, getOSMTiles }
)(MapComp);
