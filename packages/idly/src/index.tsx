import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Im = require('immutable');
import * as R from 'ramda';
import { Provider } from 'react-redux';
import * as turf from 'turf';

import { store } from 'common/store';

import { parseXML } from 'osm/parsers/parsers';

import { attachToWindow } from 'utils/attach_to_window';

import { Map } from 'map/map';
import { osmReducer } from 'map/store/map.reducer';

require('mapbox-gl/dist/mapbox-gl.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');

attachToWindow('R', R);
attachToWindow('Im', Im);
attachToWindow('turf', turf);
attachToWindow('pp', parseXML);
attachToWindow('common/store', store);

ReactDOM.render(
  <Provider store={store}>
    <Map />
  </Provider>,
  document.getElementById('root')
);
