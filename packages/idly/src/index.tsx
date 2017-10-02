import * as Im from 'immutable';
import * as R from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as turf from 'turf';
import { App } from './app/App';

import { store } from 'common/store';

import { attachToWindow } from 'utils/attach_to_window';

require('mapbox-gl/dist/mapbox-gl.css');

// require('antd/dist/antd.css');
// require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
require('./index.css');

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

// shim
window.requestIdleCallback =
  window.requestIdleCallback ||
  function(cb) {
    const start = Date.now();
    return setTimeout(function() {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function(id) {
    clearTimeout(id);
  };
