import { LngLatBounds } from 'mapbox-gl';

import { handleErrors } from 'network/helper';
import { parseXML } from 'osm/parsers/parsers';

const SphericalMercator = require('@mapbox/sphericalmercator');
const osmtogeojson = require('osmtogeojson');

const merc = new SphericalMercator({
  size: 256
});

export async function fetchTile(x: number, y: number, zoom: number) {
  const xyz = [x, y, zoom].join(',');
  const bboxStr = merc.bbox(x, y, zoom).join(',');
  try {
    let response = await fetch(
      `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
    );
    response = handleErrors(response);
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    return parseXML(xml);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
