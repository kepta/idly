import { Set } from 'immutable';
import * as MapboxInspect from 'mapbox-gl-inspect';
import * as React from 'react';

import { connect } from 'react-redux';

import { Entities } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

import { IRootStateType } from 'common/store';

import { attachToWindow, getFromWindow } from 'utils/attach_to_window';
import { lonlatToXYs } from 'utils/mecarator';

import { Draw } from 'draw/draw';

import { SOURCES, ZOOM } from 'map/constants';
import { FillLayer } from 'map/layers/area';
import { LineLayer } from 'map/layers/line';
import { LineLabelLayer } from 'map/layers/lineLabel';
import { PointsWithLabels } from 'map/layers/pointsWithLabels';
import { PointsWithoutLabels } from 'map/layers/pointsWithoutLabel';
import { mapboxglSetup } from 'map/mapboxglSetup';
import { Source } from 'map/source';
import { getOSMTiles, updateSource } from 'map/store/map.actions';
import { updateLayer as updateLayerX } from 'map/style';
import { ILayerSpec } from 'map/utils/layerFactory';
import { dirtyPopup } from 'map/utils/map.popup';

type Entity = Node | Way | Relation;
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
  entities: Entities;
  modifiedEntities: Entities;
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
  updateLayer = (layerSpec: ILayerSpec) => {
    updateLayerX(layerSpec);
    // let newLayer = layerSpec.toJS();
    // newLayer = R.reject(R.isNil, newLayer);
    // this.map.addLayer(newLayer);
  };
  dispatchTiles = () => {
    if (this.map.getZoom() < ZOOM) return;
    const lonLat = this.map.getBounds();
    if (getFromWindow('smaller')) {
      const xys = lonlatToXYs(lonLat, 18);
      console.log(xys);
      this.props.getOSMTiles(xys, 18);
    } else {
      const xys = lonlatToXYs(lonLat, ZOOM);
      this.props.getOSMTiles(xys, ZOOM);
    }
  };
  dirtyMapAccess = mapCb => this.state.mapLoaded && mapCb(this.map);
  render() {
    return (
      <div>
        <div id="map-container" style={{ height: '100vh', width: '100vw' }} />
        {this.state.mapLoaded &&
          <div>
            <Draw dirtyMapAccess={this.dirtyMapAccess} />
            {SOURCES.map((s, k) =>
              <Source
                key={k}
                sourceName={s.source}
                dirtyMapAccess={this.dirtyMapAccess}
                updateSource={this.props.updateSource}
                entities={this.props[s.data]}>
                <PointsWithoutLabels
                  sourceName={s.source}
                  name={s.source + PointsWithoutLabels.displayName}
                  entities={this.props[s.data]}
                  updateLayer={this.updateLayer}
                />
                <PointsWithLabels
                  sourceName={s.source}
                  name={s.source + PointsWithLabels.displayName}
                  entities={this.props[s.data]}
                  updateLayer={this.updateLayer}
                />
                <LineLayer
                  sourceName={s.source}
                  name={s.source + LineLayer.displayName}
                  entities={this.props[s.data]}
                  updateLayer={this.updateLayer}
                />
                <LineLabelLayer
                  sourceName={s.source}
                  name={s.source + FillLayer.displayName}
                  entities={this.props[s.data]}
                  updateLayer={this.updateLayer}
                />
                {/* <FillLayer
                  sourceName={s.source}
                  name={s.source + FillLayer.displayName}
                  entities={this.props[s.data]}
                  updateLayer={this.updateLayer}
                /> */}
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
    modifiedEntities: state.core.modifiedEntities
  }),
  { updateSource, getOSMTiles }
)(MapComp);
