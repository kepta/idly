import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Mapp } from './components/Map';
require('mapbox-gl/dist/mapbox-gl.css');
require('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');

console.log('hi');
ReactDOM.render(<Mapp />, document.getElementById('root'));
