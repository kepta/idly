import { action, Action } from 'common/actions';
import { Entities } from 'osm/entities/entities';

export const OSM_TILES = {
  get: 'OSM_TILES.get',
  saveTile: 'OSM_TILES.saveTile',
  errorSaveTile: 'OSM_TILES.errorSaveTile',
  mergeIds: 'OSM_TILES.mergeIds'
};

export const MAP = {
  updateSources: 'Map.updateSources'
};
export type GetOSMTilesAction = Action<{
  xys: number[][];
  zoom: number;
}>;

export type UpdateSourcesAction = Action<{
  dirtyMapAccess: (map: any) => void;
  data: Entities;
  sourceId: string;
}>;

export const getOSMTiles = (
  xys: number[][],
  zoom: number = 16
): GetOSMTilesAction => action(OSM_TILES.get, { xys, zoom });

export const updateSource = (
  data: Entities,
  dirtyMapAccess: (map: any) => void,
  sourceId: string
): UpdateSourcesAction =>
  action(MAP.updateSources, { data, dirtyMapAccess, sourceId });
