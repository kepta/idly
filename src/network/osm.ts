import { LngLatBounds } from 'mapbox-gl';

import { handleErrors } from './helper';
import { parse } from 'src/osm/network/parser';
var SphericalMercator = require('@mapbox/sphericalmercator');
var osmtogeojson = require('osmtogeojson');

const merc = new SphericalMercator({
  size: 256
});

export async function fetchTile(x: number, y: number, zoom: number) {
  var xyz = [x, y, zoom].join(',');
  const bboxStr = merc.bbox(x, y, zoom).join(',');
  try {
    let response = await fetch(
      `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
    );
    response = handleErrors(response);
    let text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    return [osmtogeojson(xml), parse(xml)];
  } catch (e) {
    console.error(e);
    throw e;
  }
}
