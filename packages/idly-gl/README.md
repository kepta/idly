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
<html>
<head>
    <meta charset="utf-8">
    <title>
    </title>
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css' rel='stylesheet' />
 <script src='https://unpkg.com/idly-gl@latest/dist/idly-gl.js'></script>
 </head>
</html>
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

<detail>

```html
<html>
<head>
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css' rel='stylesheet' />
    <script src='https://unpkg.com/idly-gl@latest/dist/idly-gl.js'></script>
    <style>
        #map { position:absolute; top:0; bottom:0; width:100%; }
    </style>
</head>

<body>
    <div id="map"></div>
    <script>
        mapboxgl.accessToken = 'your mapbox access token';
        var map = new mapboxgl.Map({
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-74.0066, 40.7135],
            zoom: 18.5,
            hash: true,
            container: 'map'
        });
        var idly = new IdlyGl.default();
        map.addControl(idly);
    </script>
</body>

</html>
```

</detail>
