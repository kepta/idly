import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Im = require('immutable');
import * as turf from 'turf';
import { Provider } from 'react-redux';

import { Mapp } from 'src/components/map/index';
import { osmReducer } from 'src/store/osm_tiles/reducer';
import { store } from 'src/store/index';
import { Entity } from 'src/osm/entity.new';

require('mapbox-gl/dist/mapbox-gl.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
const win: any = window;
win.Im = Im;
win.turf = turf;
win.Entity = Entity;

ReactDOM.render(
  <Provider store={store}>
    <Mapp />
  </Provider>,
  document.getElementById('root')
);
