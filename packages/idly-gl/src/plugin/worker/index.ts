import { getEntities } from 'idly-worker/lib/operations/getEntities/main';
import { getFeaturesOfEntityIds } from 'idly-worker/lib/operations/getFeaturesOfEntityIds/main';
import { getFeaturesOfShrub } from 'idly-worker/lib/operations/getFeaturesOfShrub/main';
import { getMap } from 'idly-worker/lib/operations/getMap/main';
import { setOsmTiles } from 'idly-worker/lib/operations/setOsmTiles/main';
import { getBbox } from 'idly-worker/lib/operations/getBbox/main';
import {
  FeatureCollection,
  Point,
  Feature,
  LineString,
  Polygon
} from 'geojson';
import { Shrub } from 'idly-common/lib/state/graph/shrub';

import * as MyWorker from './worker.worker';

const PromiseWorker = require('promise-worker');
export const worker: Worker = new MyWorker();
export const promiseWorker = new PromiseWorker(worker);

export const workerFetchMap = getMap(promiseWorker);

export const workerSetOsmTiles = setOsmTiles(promiseWorker);

export const workerGetEntities = getEntities(promiseWorker);
export const workerGetBbox = getBbox(promiseWorker);

export const workerGetFeaturesOfEntityIds = getFeaturesOfEntityIds(
  promiseWorker
);

export const workerGetFeaturesOfShrub = getFeaturesOfShrub(promiseWorker);
