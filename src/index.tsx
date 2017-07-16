import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Im = require('immutable');
import * as turf from 'turf';
import { Provider } from 'react-redux';

import { Mapp } from 'src/components/map/index';
import { osmReducer } from 'src/store/osm_tiles/reducer';
import { store } from 'src/store/index';
import * as osm from 'src/osm/entity';
// import { osmNode } from 'src/osm/node';

// require('mapbox-gl/dist/mapbox-gl.css');
// require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
const win: any = window;
win.Im = Im;
win.turf = turf;
win.osm = osm;
// win.osmNode = osmNode;

ReactDOM.render(
  <Provider store={store}>
    <Mapp />
  </Provider>,
  document.getElementById('root')
);
