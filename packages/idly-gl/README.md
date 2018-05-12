# IDLY-GL

![screen](https://user-images.githubusercontent.com/6966254/38627360-d0e20dc8-3d7c-11e8-9398-31c2ca8c8d64.gif)

# What is Idly-gl

Idly-gl is a [mapbox-gl](https://www.mapbox.com/mapbox-gl-js/plugins/) plugin which renders live Openstreetmap data as an interactive layer. It uses familiar visual language of [iD](https://github.com/openstreetmap/iD) editor to display various node, ways, relations.

# Why does this exist?

## Usage

### NPM

```bash
npm i -S idly-gl
```

### CDN

Make sure to add mapbox-gl and mapbox-gl css before importing idly-gl

```HTML
 <script src='https://unpkg.com/idly-gl@latest/dist/idly-gl.js'></script>
```

## Example

### Using from NPM

```Javascript
import { IdlyGlPlugin } from 'idly-gl';

mapboxgl.accessToken = '<access_token>';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/satellite-v9',
});

map.addControl(new idlygl.IdlyGlPlugin());
```

### Using directly in HTML

For a full example visit: https://github.com/kepta/idly/packages/idly-gl/dist/index.html
