import { FeatureCollection, featureCollection } from '@turf/helpers';
import { BBox } from 'idly-common/lib/geo/bbox';

import { channelBuilder } from '../misc/channelBuilder';
import { Manager } from '../worker/store/manager';
import { WorkerActions } from './types';

export interface WorkerFetchMap {
  readonly type: WorkerActions.FetchMap;
  readonly request: {
    readonly bbox: BBox;
    readonly zoom: number;
  };
}
/**
 * this type helps in keeping the parsing worker / main side in
 * sync.
 */
export type ReturnType = GeoJSON.FeatureCollection<any>;

/** Main Thread */
/**
 *
 * @param connector
 */
export function fetchMap(
  connector: any,
): (req: WorkerFetchMap['request']) => Promise<ReturnType> {
  const channel = channelBuilder<WorkerFetchMap>(connector)(
    WorkerActions.FetchMap,
  );
  return async req => {
    const json = await channel(req);
    const fc: ReturnType = JSON.parse(json);
    return fc;
  };
}

/** Worker Thread */

export function workerFetchMap(
  manager: Manager,
): (request: WorkerFetchMap['request']) => Promise<string> {
  return async ({ bbox, zoom }) => {
    const r = await manager.receive(bbox, zoom);
    const toReturn: ReturnType = featureCollection(r);
    return JSON.stringify(toReturn);
  };
}
