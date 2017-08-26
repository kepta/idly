import * as Im from 'immutable';
import * as R from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as turf from 'turf';
import { App } from './app/App';

import { store } from 'common/store';

import { attachToWindow } from 'utils/attach_to_window';

import { Map } from 'map/map';

require('mapbox-gl/dist/mapbox-gl.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
// require('mapbox-gl-inspect/dist/mapbox-gl-inspect.css');

attachToWindow('R', R);
attachToWindow('Im', Im);
attachToWindow('store', store);

attachToWindow('turf', turf);
// attachToWindow('pp', parseXML);
attachToWindow('common/store', store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

console.log(process.env.NODE_ENV);
