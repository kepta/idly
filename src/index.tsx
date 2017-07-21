import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Im = require('immutable');
import * as R from 'ramda';
import { Provider } from 'react-redux';
import * as turf from 'turf';

import { Mapp } from 'components/map';
import * as osm from 'osm/index';
import { parseXML } from 'osm/parsers/parsers';
import { store } from 'store/index';
import { osmReducer } from 'store/osm_tiles/reducer';
import { attachToWindow } from 'utils/attach_to_window';
// import { osmNode } from 'osm/node.new';
// import { coreGraph } from 'osm/graph';

require('mapbox-gl/dist/mapbox-gl.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');

attachToWindow('R', R);
attachToWindow('Im', Im);
attachToWindow('turf', turf);
attachToWindow('osm', osm);
attachToWindow('pp', parseXML);

ReactDOM.render(
  <Provider store={store}>
    <Mapp />
  </Provider>,
  document.getElementById('root')
);
