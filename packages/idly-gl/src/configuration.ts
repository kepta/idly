export const quadkey = {
  // the min zoom level to start fetching osm data
  ZOOM_MIN: 16,
  // the max zoom level to stop fetching osm data
  ZOOM_MAX: 22,
  // quadkey overlap cutoff
  OVERLAP: {
    LESS_THAN_17: 0.55,
    LESS_THAN_18: 0.7,
    LESS_THAN_19: 0.9,
    ABOVE_19: 0.98,
  },
};

export const mapInteraction = {
  // the distance for activating an interaction
  RADIUS: 4,
};

export const BASE_SOURCE = 'idly-gl-base-src';

export const SELECT_WIDTH = {
  line: 30,
  area: 12,
  point: 16,
};

export const HOVER_WIDTH = {
  line: 30,
  area: 12,
  point: 16,
};

export const HIGHLIGHT_WIDTH = {
  line: 50,
  area: 35,
  point: 25,
};
