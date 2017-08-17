import * as SphericalMercator from '@mapbox/sphericalmercator';
import * as turfbbox from '@turf/bbox';
import * as bboxPolygon from '@turf/bbox-polygon';
import * as transformScale from '@turf/transform-scale';
import * as debounce from 'lodash.debounce';
import { fetchTile } from 'parsing/fetch';
import { nodeCombiner } from 'parsing/nodeToFeature';
import { ParentWays, parseXML } from 'parsing/parser';
import { wayCombiner } from 'parsing/wayToFeature';
import * as rbush from 'rbush';
import { EntityType } from 'structs/geometry';
import { addEntitiesTable, Table } from 'structs/table';

const tree = rbush(3);

export const mercator = new SphericalMercator({
  size: 256
});

const table: Table = new Map();
const gParentWays = new Map();

function convertToFeat(t: Table, pWays: ParentWays) {
  const arr = [];
  for (const [x, entity] of t) {
    if (entity.type === EntityType.NODE) {
      arr.push(nodeCombiner(entity, pWays));
    } else if (entity.type === EntityType.WAY) {
      arr.push(wayCombiner(entity, t));
    }
  }
  return arr;
}
const processedXYZ = new Map();
let bbox;
function insertInBush(x, y, z) {
  const [minX, minY, maxX, maxY] = mercator.bbox(x, y, z);
  tree.insert({
    minX,
    minY,
    maxX,
    maxY,
    xyz: [x, y, z].join(',')
  });
}
self.addEventListener('message', function(event) {
  const xyz = event.data;
  // processedXYZ.push(xyz);
  const [x, y, z] = event.data.split(',').map(x => parseInt(x, 10));
  bbox = mercator.bbox(x, y, z);
  if (processedXYZ.has(xyz)) return sendData();

  fetchTile(x, y, z).then(r => {
    console.time('parseXML');
    const { entities, parentWays } = parseXML(r, gParentWays);
    insertInBush(x, y, z);
    processedXYZ.set(xyz, entities);
    // addEntitiesTable(table, entities);
    console.timeEnd('parseXML');
    sendData();
    // const feats = convertToFeat(table, gParentWays);
    // return feats;
  });
  // .then(r => {
  // console.time('parse2');
  // var mapArray = [...gParentWays];
  // mapArray = mapArray.map(m => [m[0], [...m[1]]]);
  // self.postMessage(JSON.stringify(mapArray));
  // self.postMessage(JSON.stringify(r));
  //   console.timeEnd('parse2');
  // });
});

const sendData = debounce(() => {
  if (!bbox) return;

  const [minX, minY, maxX, maxY] = increaseSize(bbox);

  const xyzs = tree.search({
    minX,
    minY,
    maxX,
    maxY
  });
  const item = xyzs
    .map(x => processedXYZ.get(x.xyz))
    .filter(x => x)
    .reduce((prev, cur) => prev.concat(cur), []);
  const t: Table = new Map();
  const feats = convertToFeat(addEntitiesTable(t, item), gParentWays);
  // console.log(item);
  self.postMessage(JSON.stringify(feats));
  // const feats = convertToFeat(table, gParentWays);
}, 500);

function increaseSize(bb) {
  return turfbbox(transformScale(bboxPolygon(bb), 1.05));
}
