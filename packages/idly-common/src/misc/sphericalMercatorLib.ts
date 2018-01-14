/**
 * the @mapbox/sphericalmercator wasnt playing nice
 * so the code was copied and put in a js file.
 * TOFIX find a better solutiion
 */
// tslint:disable
export const SphericalMercatorLib = Main() as any;

function Main() {
  // Closures including constants and other precalculated values.
  const cache = {};

  const EPSLN = 1.0e-10;
  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;

  // 900913 properties.
  const A = 6378137.0;

  const MAXEXTENT = 20037508.342789244;

  // SphericalMercator constructor: precaches calculations
  // for fast tile lookups.
  function SphericalMercator(options: any) {
    options = options || {};
    // @ts-ignore
    this.size = options.size || 256;
    // @ts-ignore
    if (!cache[this.size]) {
      // @ts-ignore
      let size = this.size;
      // @ts-ignore
      const c: any = (cache[this.size] = {});
      c.Bc = [];
      c.Cc = [];
      c.zc = [];
      c.Ac = [];
      for (let d = 0; d < 30; d++) {
        c.Bc.push(size / 360);
        c.Cc.push(size / (2 * Math.PI));
        c.zc.push(size / 2);
        c.Ac.push(size);
        size *= 2;
      }
    }
    // @ts-ignore
    this.Bc = cache[this.size].Bc;
    // @ts-ignore
    this.Cc = cache[this.size].Cc;
    // @ts-ignore
    this.zc = cache[this.size].zc;
    // @ts-ignore
    this.Ac = cache[this.size].Ac;
  }

  // Convert lon lat to screen pixel value
  //
  // - `ll` {Array} `[lon, lat]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  SphericalMercator.prototype.px = function(ll: any, zoom: any) {
    const d = this.zc[zoom];
    const f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
    let x = Math.round(d + ll[0] * this.Bc[zoom]);
    let y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * -this.Cc[zoom]);
    if (x > this.Ac[zoom]) {
      x = this.Ac[zoom];
    }
    if (y > this.Ac[zoom]) {
      y = this.Ac[zoom];
    }
    // (x < 0) && (x = 0);
    // (y < 0) && (y = 0);
    return [x, y];
  };

  // Convert screen pixel value to lon lat
  //
  // - `px` {Array} `[x, y]` array of geographic coordinates.
  // - `zoom` {Number} zoom level.
  SphericalMercator.prototype.ll = function(px: any, zoom: any) {
    const g = (px[1] - this.zc[zoom]) / -this.Cc[zoom];
    const lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];
    const lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
    return [lon, lat];
  };

  // Convert tile xyz value to bbox of the form `[w, s, e, n]`
  //
  // - `x` {Number} x (longitude) number.
  // - `y` {Number} y (latitude) number.
  // - `zoom` {Number} zoom.
  // - `tms_style` {Boolean} whether to compute using tms-style.
  // - `srs` {String} projection for resulting bbox (WGS84|900913).
  // - `return` {Array} bbox array of values in form `[w, s, e, n]`.
  SphericalMercator.prototype.bbox = function(
    x: any,
    y: any,
    zoom: any,
    tmsStyle: any,
    srs: any,
  ) {
    // Convert xyz into bbox with srs WGS84
    if (tmsStyle) {
      y = Math.pow(2, zoom) - 1 - y;
    }
    // Use +y to make sure it's a number to avoid inadvertent concatenation.
    const ll = [x * this.size, (+y + 1) * this.size]; // lower left
    // Use +x to make sure it's a number to avoid inadvertent concatenation.
    const ur = [(+x + 1) * this.size, y * this.size]; // upper right
    const bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));

    // If web mercator requested reproject to 900913.
    if (srs === '900913') {
      return this.convert(bbox, '900913');
    } else {
      return bbox;
    }
  };

  // Convert bbox to xyx bounds
  //
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  // - `zoom` {Number} zoom.
  // - `tms_style` {Boolean} whether to compute using tms-style.
  // - `srs` {String} projection of input bbox (WGS84|900913).
  // - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.
  SphericalMercator.prototype.xyz = function(
    bbox: any,
    zoom: any,
    tmsStyle: any,
    srs: any,
  ) {
    // If web mercator provided reproject to WGS84.
    if (srs === '900913') {
      bbox = this.convert(bbox, 'WGS84');
    }

    const ll = [bbox[0], bbox[1]]; // lower left
    const ur = [bbox[2], bbox[3]]; // upper right
    const pxll = this.px(ll, zoom);
    const pxur = this.px(ur, zoom);
    // Y = 0 for XYZ is the top hence minY uses px_ur[1].
    const x = [
      Math.floor(pxll[0] / this.size),
      Math.floor((pxur[0] - 1) / this.size),
    ];
    const y = [
      Math.floor(pxur[1] / this.size),
      Math.floor((pxll[1] - 1) / this.size),
    ];
    const bounds = {
      minX: Math.min.apply(Math, x) < 0 ? 0 : Math.min.apply(Math, x),
      minY: Math.min.apply(Math, y) < 0 ? 0 : Math.min.apply(Math, y),
      maxX: Math.max.apply(Math, x),
      maxY: Math.max.apply(Math, y),
    };
    if (tmsStyle) {
      const tms = {
        minY: Math.pow(2, zoom) - 1 - bounds.maxY,
        maxY: Math.pow(2, zoom) - 1 - bounds.minY,
      };
      bounds.minY = tms.minY;
      bounds.maxY = tms.maxY;
    }
    return bounds;
  };

  // Convert projection of given bbox.
  //
  // - `bbox` {Number} bbox in the form `[w, s, e, n]`.
  // - `to` {String} projection of output bbox (WGS84|900913). Input bbox
  //   assumed to be the "other" projection.
  // - `@return` {Object} bbox with reprojected coordinates.
  SphericalMercator.prototype.convert = function(bbox: any, to: any) {
    if (to === '900913') {
      return this.forward(bbox.slice(0, 2)).concat(
        this.forward(bbox.slice(2, 4)),
      );
    } else {
      return this.inverse(bbox.slice(0, 2)).concat(
        this.inverse(bbox.slice(2, 4)),
      );
    }
  };

  // Convert lon/lat values to 900913 x/y.
  SphericalMercator.prototype.forward = (ll: any) => {
    const xy = [
      A * ll[0] * D2R,
      A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * ll[1] * D2R)),
    ];
    // if xy value is beyond maxextent (e.g. poles), return maxextent.
    if (xy[0] > MAXEXTENT) {
      xy[0] = MAXEXTENT;
    }
    if (xy[0] < -MAXEXTENT) {
      xy[0] = -MAXEXTENT;
    }
    if (xy[1] > MAXEXTENT) {
      xy[1] = MAXEXTENT;
    }
    if (xy[1] < -MAXEXTENT) {
      xy[1] = -MAXEXTENT;
    }
    return xy;
  };

  // Convert 900913 x/y values to lon/lat.
  SphericalMercator.prototype.inverse = (xy: any) => {
    return [
      xy[0] * R2D / A,
      (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D,
    ];
  };

  return SphericalMercator;
}
