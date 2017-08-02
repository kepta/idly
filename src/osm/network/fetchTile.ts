import { parseXML } from 'osm/parsers/parsers';
import { stubXML } from 'osm/stubs/xmlstub';
import { handleErrors } from 'utils/promise';

const SphericalMercator = require('@mapbox/sphericalmercator');
const osmtogeojson = require('osmtogeojson');

const merc = new SphericalMercator({
  size: 256
});

const fetchStub = () => {
  return Promise.resolve(stubXML);
};

export async function fetchTile(x: number, y: number, zoom: number) {
  const xyz = [x, y, zoom].join(',');
  const bboxStr = merc.bbox(x, y, zoom).join(',');
  try {
    if (window.debug) {
      return parseXML(
        new DOMParser().parseFromString(await fetchStub(), 'text/xml')
      );
    }
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
