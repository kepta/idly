export const quadkey = {
  // the min zoom level to start fetching osm data
  ZOOM_MIN: 15,
  // the max zoom level to stop fetching osm data
  ZOOM_MAX: 22,
  // quadkey overlap cutoff
  OVERLAP: {
    LESS_THAN_17: 0.55,
    LESS_THAN_18: 0.8,
    LESS_THAN_19: 1,
    ABOVE_19: 1,
  },
};

export const mapInteraction = {
  // the distance for activating an interaction
  RADIUS: 6,
};
