import { Set as $Set } from 'immutable';
import * as MapboxInspect from 'mapbox-gl-inspect';
import * as React from 'react';
import { connect } from 'react-redux';
import { selectEntitiesAction } from '../core/store/core.actions';
import { workerFetchMap, workerSetOsmTiles } from '../worker/main';

import { IRootStateType, store } from 'common/store';

import { attachToWindow } from 'utils/attach_to_window';

// import { Draw } from 'draw/draw';

import { SOURCES, ZOOM } from 'map/constants';
import { SourceLayered } from 'map/layers/layers';
import { mapboxglSetup } from 'map/mapboxglSetup';
import { Source } from 'map/source';
import {
  removeLayer as removeLayerX,
  updateLayer as updateLayerX
} from 'map/style';
import { ILayerSpec } from 'map/utils/layerFactory';
import { dirtyPopup } from 'map/utils/map.popup';

import { BBox } from 'idly-common/lib/geo/bbox';
import * as R from 'ramda';

import { Shrub } from 'idly-common/lib/state/graph/shrub';
import sizeMe from 'react-sizeme';
export type DirtyMapAccessType = (map: any) => void;
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
  entities: $Set<any>;
  modifiedEntities: $Set<any>;
  selectedShrub: Shrub;
  size: any;
}

const win: any = window;

class MapComp extends React.PureComponent<IPropsType, {}> {
  static defaultProps = {
    entities: $Set()
  };
  state = {
    mapLoaded: false,
    sourceLayered: SourceLayered,
    height: 0,
    width: 0
  };
  ref = null;
  private map;
  private currentZoom;
  private jsonqueue: string;
  private mapRenderTask: any;
  private fetchTileTask: any;
  private currentBbox: any;
  dispatchTiles = async () => {
    let zoom = this.map.getZoom();
    if (zoom < ZOOM) return;
    const lonLat = this.map.getBounds();
    const bbox: BBox = [
      lonLat.getWest(),
      lonLat.getSouth(),
      lonLat.getEast(),
      lonLat.getNorth()
    ];
    this.currentBbox = bbox;
    zoom--;
    this.currentZoom = zoom;
    await workerSetOsmTiles({ bbox, zoom });
    if (this.currentBbox === bbox) {
      const data = await workerFetchMap({
        bbox,
        zoom,
        hiddenIds: this.props.selectedShrub.toObject().knownIds
      });
      this.onWorkerDone(data);
    }
  };

  componentDidMount() {
    this.map = mapboxglSetup('map-container');
    attachToWindow('map', this.map);
    attachToWindow('popup', () => dirtyPopup(this.map));
    attachToWindow('MapboxInspect', MapboxInspect);
    attachToWindow('hideLayer', name => {
      window.ggg = this.state.sourceLayered[0].filter(
        f => f.displayName === name
      );
      this.setState({
        sourceLayered: [
          this.state.sourceLayered[0].filter(f => f.displayName !== name),
          this.state.sourceLayered[1].filter(f => f.displayName !== name)
        ]
      });
    });
    attachToWindow('appendLayer', name => {
      this.setState({
        sourceLayered: [
          this.state.sourceLayered[0].concat(window.ggg),
          this.state.sourceLayered[1].filter(f => f.displayName !== name)
        ]
      });
    });
    this.map.on('click', e => {
      const bbox = [
        [e.point.x - 4, e.point.y - 4],
        [e.point.x + 4, e.point.y + 4]
      ];
      const select: string[] = R.compose(
        R.take(1),
        R.reject(R.isNil),
        R.map(R.path(['properties', 'id']))
      )(this.map.queryRenderedFeatures(bbox));
      store.dispatch(selectEntitiesAction(select));
    });
    this.map.on('load', () => {
      this.setState({ mapLoaded: true });
    });
    this.map.on('moveend', () => {
      this.fetchTileTask = win.requestIdleCallback(this.dispatchTiles, {
        timeout: 2500
      });
    });
    this.map.on('movestart', () => {
      if (this.fetchTileTask) {
        win.cancelIdleCallback(this.fetchTileTask);
        this.fetchTileTask = null;
      }
    });
  }
  onWorkerDone = data => {
    console.log(data);

    console.time('parse1');

    if (data === this.jsonqueue) {
      console.log('repeat string');
      return;
    }
    this.jsonqueue = data;
    // this.map.getSource('virgin').setData(turf.featureCollection(parsed));
    if (this.mapRenderTask) {
      console.log('canceled');
      win.cancelIdleCallback(this.mapRenderTask);
      this.mapRenderTask = null;
    }
    this.mapRenderTask = win.requestIdleCallback(this.parsePending, {
      timeout: 300
    });
  };
  parsePending = () => {
    if (this.jsonqueue) {
      this.map.getSource('virgin').setData(this.jsonqueue);
      console.timeEnd('parse1');
    }
  };
  updateLayer = (layerSpec: ILayerSpec) => {
    updateLayerX(layerSpec);
  };
  removeLayer = (layerId: string) => {
    removeLayerX(layerId);
  };

  async componentWillReceiveProps(nextProps: IPropsType, nextState) {
    if (nextProps.size.height !== this.props.size.height) {
      console.log('resizing map');
      window.requestIdleCallback(() => this.map.resize());
    }
    if (
      this.currentBbox &&
      nextProps.selectedShrub !== this.props.selectedShrub
    ) {
      const data = await workerFetchMap({
        bbox: this.currentBbox,
        zoom: this.currentZoom,
        hiddenIds: nextProps.selectedShrub.toObject().knownIds
      });
      this.onWorkerDone(data);
    }
  }

  dirtyMapAccess = mapCb => this.state.mapLoaded && mapCb(this.map);
  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <div id="map-container" style={{ height: this.props.size.height }} />
        {this.state.mapLoaded && (
          <div>
            {SOURCES.map((s, k) => (
              <Source
                key={k}
                sourceName={s.source}
                dirtyMapAccess={this.dirtyMapAccess}
                updateSource={() => ({})}
                entities={this.props[s.data]}>
                {this.state.sourceLayered[k].map((L, i) => (
                  <L
                    key={i}
                    entities={this.props[s.data]}
                    updateLayer={this.updateLayer}
                    removeLayer={this.removeLayer}
                  />
                ))}
              </Source>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export const Map = connect<any, any, any>((state: IRootStateType, props) => ({
  entities: $Set(),
  modifiedEntities: $Set(),
  selectedShrub: state.core.selectedShrub
}))(sizeMe({ monitorHeight: true, monitorWidth: true })(MapComp));
