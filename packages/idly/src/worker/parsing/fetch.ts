import { mercator } from 'idly-common/lib/geo/sphericalMercator';
import { handleErrors } from 'idly-common/lib/network/promise';
import { DOMParser } from 'xmldom';

import { stubXML } from '../parsing/fixtures';

// const merc = new SphericalMercator({
//   size: 256
// });

const fetchStub = () => {
  return Promise.resolve(stubXML);
};

const debug = false;

export async function fetchTile(x: number, y: number, zoom: number) {
  const xyz = [x, y, zoom].join(',');
  const bboxStr = mercator.bbox(x, y, zoom).join(',');
  try {
    if (debug) {
      return new DOMParser().parseFromString(await fetchStub(), 'text/xml');
    }
    let response = await fetch(
      `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
    );
    response = handleErrors(response);
    const text = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    return xml;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
