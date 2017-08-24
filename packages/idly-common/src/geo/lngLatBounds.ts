// @NOTE copy of mapboxgl lngLatBounds,
//    this is a subset of actual interface
export interface LngLatBounds {
  /** Extend the bounds to include a given LngLat or LngLatBounds. */
  extend(obj: LngLatBounds): this;

  /** Get west edge longitude */
  getWest(): number;

  /** Get south edge latitude */
  getSouth(): number;

  /** Get east edge longitude */
  getEast(): number;

  /** Get north edge latitude */
  getNorth(): number;
}
