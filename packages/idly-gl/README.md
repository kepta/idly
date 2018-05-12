<h1 align="center">
  <br>
  <!-- <a href=""><img src="" alt="logo" width="200"></a> -->
  <br>
  Idly-Gl
  <br>
</h1>

# What is Idly-gl?

Idly-gl is a [mapbox-gl](https://www.mapbox.com/mapbox-gl-js/plugins/) plugin which renders live Openstreetmap data as an interactive layer.

<p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://user-images.githubusercontent.com/6966254/39957699-eaaa7ae6-5614-11e8-9149-3d553c8055fc.gif"
         alt="screeh">
  </a>
</p>

# What does it do?

Idly-gl is an easy to use mapbox-gl plugin to help you instantly add live Openstreetmap data. Mapbox GL JS is a JavaScript library that uses WebGL to render fast interactive maps. This plugin uses the Openstreetmap [API](https://wiki.openstreetmap.org/wiki/API_v0.6#Retrieving_map_data_by_bounding_box:_GET_.2Fapi.2F0.6.2Fmap) to render OSM data.

* It renders live osm data on mapbox-gl map.

![image](https://user-images.githubusercontent.com/6966254/39957287-340973d8-560e-11e8-92ee-73f4fdb85cd2.png)

* It tries to mimic [iD](https://github.com/openstreetmap/iD) editor's familiar styling

![idly_id_style](https://user-images.githubusercontent.com/6966254/39957431-baeb8c86-5610-11e8-9b7f-a0aca9c884e2.gif)

* Helpful data inspection

![screen](https://user-images.githubusercontent.com/6966254/38627360-d0e20dc8-3d7c-11e8-9398-31c2ca8c8d64.gif)

* Add to any mapbox-gl, anytime!

![add_anytime](https://user-images.githubusercontent.com/6966254/39964382-137eb1ee-56a1-11e8-8883-c1ece2606764.gif)

## Demo

https://kepta.github.io/idly/idly-gl/

## User guide

Head over to the [Usage Guide](https://github.com/kepta/idly/wiki)

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

```javascript
var idly = new IdlyGl.default();
map.addControl(idly);
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

<details>

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

</details>
