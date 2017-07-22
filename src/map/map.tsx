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
import { getOSMTiles, updateSources } from 'store/map/actions';
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
  updateSources: (data: Entities, dirtyMapAccess: (map: any) => void) => void;
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
    if (!this.state.mapLoaded) return;

    // console.log(entities);
    const entities = nextProps.entities; // d.subtract(this.prop);
    this.props.updateSources(entities, this.dirtyMapAccess);
    // const features = entities
    //   .toArray()
    //   .filter(f => f instanceof Node)
    //   .map(nodeToFeat);

    // this.features = features; // this.features.concat(features);
    // const source = this.map.getSource('layer');
    // if (source) {
    //   source.setData(turf.featureCollection(this.features));
    // } else {
    //   this.map.addSource('layer', {
    //     type: 'geojson',
    //     data: turf.featureCollection([]) // someFC().data
    //   });
    //   this.map.addLayer(someLayer());
    // }
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
    entities: state.core.entities
  }),
  { updateSources }
)(MapComp);

// export class Mapx {
//   private map;
//   private draw;
//   private xy;
//   private features;
//   private prop: Set<Entity>;
//   private loaded;
//   constructor(divId: string) {
//     this.map = genMapGl(divId);
//     this.map.on('moveend', deb(this.dispatchTiles, 100));
//     this.map.on('load', this.onLoad);
//     this.features = [];
//     this.prop = Set();
//     unsubscribe = observe(
//       state => state.core.get('entities'),
//       deb(this.receiveProps, 300)
//     );
//   }
//   private receiveProps = (d: Set<Node | Way | Relation>) => {
//     const newProp = d; // d.subtract(this.prop);
//     const features = newProp
//       .toArray()
//       .filter(f => f instanceof Node)
//       .map(nodeToFeat);
//     this.features = features; // this.features.concat(features);
//     const source = this.map.getSource('layer');
//     if (!this.loaded) return;
//     if (source) {
//       source.setData(turf.featureCollection(this.features));
//     } else {
//       this.map.addSource('layer', {
//         type: 'geojson',
//         data: turf.featureCollection([]) // someFC().data
//       });
//       this.map.addLayer(someLayer());
//     }
//   };
//   private onLoad = () => {
//     this.draw = new Draw(this.map);
//     this.loaded = true;
//     this.dispatchTiles();
//   };
//   /**
//    * Is called whenever map finishes move
//    * or the map got loaded.
//    * dispatches an action to get the osm tiles.
//    */
//   private dispatchTiles = () => {
//     if (this.map.getZoom() < ZOOM) return;
//     const ltlng = this.map.getBounds();
//     const xys = lonlatToXYs(ltlng, ZOOM);
//     store.dispatch(getOSMTiles(xys, ZOOM));
//   };
// }

function xsomeLayer() {
  return {
    id: 'park-volcanoes',
    type: 'circle',
    source: 'layer',
    paint: {
      'circle-radius': 3,
      'circle-color': '#E80C7A',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    },
    filter: ['==', '$type', 'Point']
  };
}
function xsomeFC() {
  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-121.353637, 40.584978],
                [-121.284551, 40.584758],
                [-121.275349, 40.541646],
                [-121.246768, 40.541017],
                [-121.251343, 40.423383],
                [-121.32687, 40.423768],
                [-121.360619, 40.43479],
                [-121.363694, 40.409124],
                [-121.439713, 40.409197],
                [-121.439711, 40.423791],
                [-121.572133, 40.423548],
                [-121.577415, 40.550766],
                [-121.539486, 40.558107],
                [-121.520284, 40.572459],
                [-121.487219, 40.550822],
                [-121.446951, 40.56319],
                [-121.370644, 40.563267],
                [-121.353637, 40.584978]
              ]
            ]
          }
        }
      ]
    }
  };
}
