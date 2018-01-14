declare module '@mapbox/sphericalmercator' {
  class SphericalMercator {
    constructor(x: { size: number });
    bbox(x: number, y: number, zoom: number): number[];
    xyz(
      x: any,
      y: any,
    ): { minX: number; minY: number; maxX: number; maxY: number };
  }
  export = SphericalMercator;
}
