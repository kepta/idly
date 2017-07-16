import { LngLatBounds } from 'mapbox-gl';
import { action } from 'src/store/actions';

export const OSM_TILES = {
  fetch: 'OSM_TILES.fetch'
};

export const getOSMTiles = (ltlng: LngLatBounds, zoom: number = 16) =>
  action(OSM_TILES.fetch, { ltlng, zoom });
