import * as SphericalMercator from '@mapbox/sphericalmercator';
import * as turfbbox from '@turf/bbox';
import * as turfHelpers from '@turf/helpers';

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

export const numbereluu = { fighterFoo: 10, kaambai: 'hell;;'};

export const workerFunc = function(self: WorkerGlobalScope) {
  const mercator = new SphericalMercator({
    size: 256
  });
  const tree = rbush(3);

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

  function increaseSize(bb) {
    return turfbbox(transformScale(bboxPolygon(bb), 1.05));
  }
  self.addEventListener('message', function(event) {
    const xyz = event.data;
    const [x, y, z] = event.data.split(',').map(x => parseInt(x, 10));
    bbox = mercator.bbox(x, y, z);
    if (processedXYZ.has(xyz)) return sendData();

    fetchTile(x, y, z).then(r => {
      console.time('parseXML');
      const { entities, parentWays } = parseXML(r, gParentWays);
      insertInBush(x, y, z);
      processedXYZ.set(xyz, entities);
      console.timeEnd('parseXML');
      sendData();
    });
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
    self.postMessage(JSON.stringify(turfHelpers.featureCollection(feats)));
  }, 500);
};
