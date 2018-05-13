<h1 align="center">
  <br>
 🍚
  <br>
  IDLY-GL
  <br>
</h1>
<p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://user-images.githubusercontent.com/6966254/39964464-e91b3f56-56a2-11e8-80c8-27b915b9f41a.gif"
         alt="screeh">
  </a>
</p>
<div align="center">
A Mapbox-gl plugin for rendering Openstreetmap data.<a href="https://kepta.github.io/idly/idly-gl/">DEMO</a>
</div>

<h2>Table of Contents</h2>

<!-- toc -->

* [What does it do?](#what-does-it-do)
* [Show me!](#show-me)
* [Usage](#usage)
  * [NPM](#npm)
  * [CDN](#cdn)
* [API](#api)
* [Examples](#examples)
* [User Guide](#user-guide)

<!-- tocstop -->

## What does it do?

Idly-gl is an easy to use mapbox-gl plugin to help you instantly add live Openstreetmap data. This plugin uses the Openstreetmap [API](https://wiki.openstreetmap.org/wiki/API_v0.6#Retrieving_map_data_by_bounding_box:_GET_.2Fapi.2F0.6.2Fmap) to render OSM data.

* 😎 It renders live osm data on a mapbox-gl map, which makes it blazingly fast.

![image](https://user-images.githubusercontent.com/6966254/39957287-340973d8-560e-11e8-92ee-73f4fdb85cd2.png)

* 👯‍♀️ It tries to mimic [iD](https://github.com/openstreetmap/iD) editor's familiar styling.

![idly_id_style](https://user-images.githubusercontent.com/6966254/39957431-baeb8c86-5610-11e8-9b7f-a0aca9c884e2.gif)

* 🕵 Dig deep into OSM entities, by interacting with them.

![screen](https://user-images.githubusercontent.com/6966254/38627360-d0e20dc8-3d7c-11e8-9398-31c2ca8c8d64.gif)

* 💪 Add to any existing mapbox-gl map to give it OSM superpowers.

![add_anytime](https://user-images.githubusercontent.com/6966254/39964382-137eb1ee-56a1-11e8-8883-c1ece2606764.gif)

## Show me!

[Click here to demo idly-gl](https://kepta.github.io/idly/idly-gl/)

## Usage

### NPM

```bash
npm i -S idly-gl
```

```javascript
import IdlyGl from 'idly-gl';

mapboxgl.accessToken = '<access_token>';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/satellite-v9',
});
map.addControl(new IdlyGl());
```

(Note: If you are not familiar with setting up a mapbox-gl map or the access token, look [here](https://www.mapbox.com/mapbox-gl-js/example/simple-map/).)

### CDN

Make sure to add mapbox-gl and mapbox-gl css before importing idly-gl.

```HTML
<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css' rel='stylesheet' />
<script src='https://unpkg.com/idly-gl@latest/dist/idly-gl.js'></script>
```

```javascript
var idly = new IdlyGl.default();
map.addControl(idly);
```

## API

Head over to [wiki/API](https://github.com/kepta/idly/wiki/API)

## Examples

Head over to the [wiki/examples](https://github.com/kepta/idly/wiki/examples) for more examples.

## User Guide

Head over to the [wiki/User Guide](https://github.com/kepta/idly/wiki/User_Guide) to understand idly-gl's features.
