import { fromJS, OrderedMap, Set as $Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';

import { BBox } from '@turf/helpers';
import { IRootStateType } from 'common/store';
import sizeMe from 'react-sizeme';
import {
  workerFetchMap,
  workerGetFeaturesOfTree,
  workerSetOsmTiles
} from '../worker/main';

import { selectEntitiesAction } from 'core/store/core.actions';
import debounce from 'lodash.debounce';
import { SourceLayered } from 'map/layers/layers';
import {
  removeLayer as removeLayerX,
  updateLayer as updateLayerX
} from 'map/style';
import { ILayerSpec } from 'map/utils/layerFactory';
import { featureCollection } from 'map2/styleGen';
import * as R from 'ramda';
import { reqCancelableIdleCb } from 'utils/cancellablePromise';
const win: any = window;
const satLayer = fromJS({
  id: 'satellite',
  type: 'raster',
  source: 'mapbox',
  'source-layer': 'mapbox_satellite_full'
});
class MapController extends React.PureComponent<any, any> {
  private mapInfo;
  private prevGeojson;
  private displayGeojsonCb;
  private debouncedDispatchTiles;
  private debouncedRenderGlStyle;
  private styledWithLayers;
  private layers: OrderedMap<string, any> = OrderedMap({});
  private prevLayers: OrderedMap<string, any>;
  constructor(props) {
    super(props);
    this.debouncedDispatchTiles = debounce(this.dispatchTiles, 500);
    this.debouncedRenderGlStyle = debounce(this.renderGlLayers, 200);
    this.styledWithLayers = this.props.mapStyle([]);
    this.onMoveEnd();
    this.onClick();
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.selectedTree.isEqual(this.props.selectedTree)) {
      this.fetchMap();
      this.renderModifiedEntities();
    }
  }
  onClick() {
    this.props.map.on('click', e => {
      const bbox = [
        [e.point.x - 4, e.point.y - 4],
        [e.point.x + 4, e.point.y + 4]
      ];
      const select: string[] = R.compose(
        R.take(1),
        R.reject(R.isNil),
        R.map(R.path(['properties', 'id']))
      )(this.props.map.queryRenderedFeatures(bbox));

      store.dispatch(selectEntitiesAction(select));
      this.fetchMap();
    });
  }
  onMoveEnd() {
    let cb;
    this.props.map.on('moveend', () => {
      win.cancelIdleCallback(cb);
      cb = win.requestIdleCallback(this.debouncedDispatchTiles, {
        timeout: 700
      });
    });
  }
  dispatchTiles = async () => {
    const zoom = this.props.map.getZoom() - 1;
    if (zoom < 15) return;
    const lonLat = this.props.map.getBounds();
    const bbox: BBox = [
      lonLat.getWest(),
      lonLat.getSouth(),
      lonLat.getEast(),
      lonLat.getNorth()
    ];
    this.mapInfo = { bbox, zoom };
    await workerSetOsmTiles({ bbox, zoom });
    win.cancelIdleCallback(this.displayGeojsonCb);
    this.displayGeojsonCb = win.requestIdleCallback(this.fetchMap, {
      timeout: 300
    });
  };
  renderGlLayers = () => {
    if (this.layers.equals(this.prevLayers)) {
      return;
    }
    console.log('called');
    this.prevLayers = this.layers;
    const layers = this.layers
      .map((v: ILayerSpec) => {
        let layer = v.toJS();
        layer = R.reject(R.isNil, layer);
        return layer;
      })
      .sort((a, b) => a.priority - b.priority)
      .toArray();

    this.props.map.setStyle(
      this.props.mapStyle(layers)({
        virgin: {
          type: 'geojson',
          data: featureCollection()
        },
        modified: {
          type: 'geojson',
          data: featureCollection()
        }
      })
    );
  };
  renderModifiedEntities = async () => {
    const data = await workerGetFeaturesOfTree({
      treeString: this.props.selectedTree.toString()
    });
    console.log(data);
    this.props.map.getSource('modified').setData(featureCollection(data));
  };
  fetchMap = async () => {
    const data = await workerFetchMap({
      ...this.mapInfo,
      hiddenIds: this.props.selectedTree.getKnownIds()
    });
    console.log(data);
    if (data === this.prevGeojson) {
      console.log('repeat string');
      return;
    }
    this.prevGeojson = data;
    this.props.map.getSource('virgin').setData(data);
  };
  updateLayer = (immutableLayer: ILayerSpec) => {
    this.layers = this.layers.set(immutableLayer.get('id'), immutableLayer);
    this.debouncedRenderGlStyle();
  };
  removeLayer = (layerId: string) => {
    removeLayerX(layerId);
  };
  render() {
    return (
      <div>
        {SourceLayered[0].map((L, i) => (
          <L
            key={i}
            entities={$Set()}
            updateLayer={this.updateLayer}
            removeLayer={this.removeLayer}
          />
        ))}
        {SourceLayered[1].map((L, i) => (
          <L
            key={SourceLayered[0].length + i}
            entities={$Set()}
            updateLayer={this.updateLayer}
            removeLayer={this.removeLayer}
          />
        ))}
      </div>
    );
  }
}

export const Controller = connect<
  any,
  any,
  any
>((state: IRootStateType, props) => ({
  selectedTree: state.core.selectedTree
}))(sizeMe({ monitorHeight: true, monitorWidth: true })(MapController));
