import { Set } from 'immutable';
import { debounce } from 'lodash';
import * as MapboxInspect from 'mapbox-gl-inspect';
import * as R from 'ramda';
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

import { FillLayer } from 'map/layers/area';
import { LineLayer } from 'map/layers/line';
import { Layer } from 'map/layers/points';
import { PointsWithLabels } from 'map/layers/pointsWithLabels';
import { PointsWithoutLabels } from 'map/layers/pointsWithoutLabel';
import { addLayers } from 'map/layers/style';
import { mapboxglSetup } from 'map/mapboxglSetup';
import { Source } from 'map/source';
import { getOSMTiles, updateSource } from 'map/store/map.actions';
import { dirtyPopup } from 'map/utils/map.popup';

export const ZOOM = 16;
export const SOURCES = [
  {
    source: 'virgin',
    data: 'entities'
  },
  {
    source: 'modified',
    data: 'modifiedEntities'
  }
];
const _LAYERS = [
  PointsWithLabels.displayName,
  PointsWithoutLabels.displayName,
  LineLayer.displayName
  // FillLayer.displayName
];
export const LAYERS = _LAYERS
  .map(l => SOURCES.map(s => s.source + l))
  .reduce((prv, c) => prv.concat(c), []);

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
  dispatchTiles = () => {
    if (this.map.getZoom() < ZOOM) return;
    const ltlng = this.map.getBounds();
    if (window.smaller) {
      const xys = lonlatToXYs(ltlng, 18);
      console.log(xys);
      this.props.getOSMTiles(xys, 18);
    } else {
      const xys = lonlatToXYs(ltlng, ZOOM);
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
            <Draw dirtyMapAccess={this.dirtyMapAccess} layers={LAYERS} />
            {SOURCES.map((s, k) =>
              <Source
                key={k}
                sourceName={s.source}
                dirtyMapAccess={this.dirtyMapAccess}
                updateSource={this.props.updateSource}
                entities={this.props[s.data]}
              >
                {/* <Layer
                  sourceName={s.source}
                  name={s.layer}
                  dirtyMapAccess={this.dirtyMapAccess}
                  entities={this.props[s.data]}
                  updateSource={this.props.updateSource}
                /> */}
                <PointsWithoutLabels
                  sourceName={s.source}
                  name={s.source + PointsWithoutLabels.displayName}
                  dirtyMapAccess={this.dirtyMapAccess}
                  entities={this.props[s.data]}
                  updateSource={this.props.updateSource}
                />
                <PointsWithLabels
                  sourceName={s.source}
                  name={s.source + PointsWithLabels.displayName}
                  updateSource={this.props.updateSource}
                  dirtyMapAccess={this.dirtyMapAccess}
                  entities={this.props[s.data]}
                />
                <LineLayer
                  sourceName={s.source}
                  name={s.source + LineLayer.displayName}
                  updateSource={this.props.updateSource}
                  dirtyMapAccess={this.dirtyMapAccess}
                  entities={this.props[s.data]}
                />
                <FillLayer
                  sourceName={s.source}
                  name={s.source + FillLayer.displayName}
                  updateSource={this.props.updateSource}
                  dirtyMapAccess={this.dirtyMapAccess}
                  entities={this.props[s.data]}
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
    modifiedEntities: state.core.modifiedEntities
  }),
  { updateSource, getOSMTiles }
)(MapComp);
