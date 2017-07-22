import { LngLatBounds } from 'mapbox-gl';
import { action, Action } from 'store/actions';
import { Entities } from 'osm/entities/entities';

export const OSM_TILES = {
  get: 'OSM_TILES.get',
  saveTile: 'OSM_TILES.saveTile'
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
}>;

export const getOSMTiles = (
  xys: number[][],
  zoom: number = 16
): GetOSMTilesAction => action(OSM_TILES.get, { xys, zoom });

export const updateSources = (
  data: Entities,
  dirtyMapAccess: (map: any) => void
): UpdateSourcesAction => action(MAP.updateSources, { data, dirtyMapAccess });
