# IDLY-GL

> Note: this is currently highly experimental !

A mapbox-gl plugin to render Openstreetmap as geojson layer using [iD](https://github.com/openstreetmap/iD)'s style.

## Usage

### NPM

```bash
npm i -S idly-gl
```

### CDN

Make sure add mapbox-gl before importing idly-gl

```HTML
 <script src='https://unpkg.com/idly-gl@latest/dist/idly-gl.js'></script>
```

## Example

```Javascript
import idlygl from 'idly-gl';

mapboxgl.accessToken = '<access_token>';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/satellite-v9',
});
map.addControl(new idlygl.IdlyGlPlugin());
```

For a full example visit: https://github.com/kepta/idly-gl-example
