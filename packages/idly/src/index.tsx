import * as Im from 'immutable';
import * as R from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as turf from 'turf';

import { store } from 'common/store';

import { parseXML } from 'osm/parsers/parsers';

import { attachToWindow } from 'utils/attach_to_window';

import { Map } from 'map/map';
import { presetsMatch } from 'osm/presets/presets';

import { tagsFactory } from 'osm/entities/helpers/tags';
import { wayFactory } from 'osm/entities/way';
import { graphFactory } from 'osm/history/graph';

require('mapbox-gl/dist/mapbox-gl.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');
require('mapbox-gl-inspect/dist/mapbox-gl-inspect.css');

attachToWindow('R', R);
attachToWindow('Im', Im);
attachToWindow('store', store);

attachToWindow('turf', turf);
attachToWindow('pp', parseXML);
attachToWindow('common/store', store);
attachToWindow('presetsMatch', presetsMatch);
attachToWindow('wayFactory', wayFactory);
attachToWindow('graphFactory', graphFactory);
attachToWindow('tagsFactory', tagsFactory);

ReactDOM.render(
  <Provider store={store}>
    <Map />
  </Provider>,
  document.getElementById('root')
);

console.log(process.env.NODE_ENV);
