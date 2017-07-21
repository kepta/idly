import { LngLatBounds } from 'mapbox-gl';
import { action, Action } from 'store/actions';

export const OSM_TILES = {
  get: 'OSM_TILES.get',
  saveTile: 'OSM_TILES.saveTile'
};

export interface IGetOSMTilesType {
  xys: number[][];
  zoom: number;
}

export const getOSMTiles = (xys: number[][], zoom: number = 16) =>
  action(OSM_TILES.get, { xys, zoom });
