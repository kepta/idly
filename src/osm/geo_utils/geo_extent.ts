import { List, Record } from 'immutable';

import { genLngLat, LngLat } from 'osm/geo_utils/lng_lat';
import { geoMetersToLat, geoMetersToLon } from 'osm/geo_utils/misc';

export class GeoExtent extends Record({
  lower: genLngLat([Infinity, Infinity]),
  upper: genLngLat([-Infinity, -Infinity])
}) {
  public lower: LngLat;
  public upper: LngLat;
}
export function geoExtent(point1?: LngLat, point2?: LngLat): GeoExtent {
  const extent = {};
  if (arguments.length === 1) {
    return new GeoExtent({ lower: point1, upper: point1 });
  } else if (arguments.length === 2) {
    return new GeoExtent({
      lower: genLngLat({
        lon: Math.min(point1.lon, point2.lon),
        lat: Math.min(point1.lat, point2.lat)
      }),
      upper: genLngLat({
        lon: Math.max(point1.lon, point2.lon),
        lat: Math.max(point1.lat, point2.lat)
      })
    });
  } else {
    return new GeoExtent();
  }
}

export function center(g: GeoExtent): LngLat {
  return genLngLat([
    (g.lower.lon + g.upper.lon) / 2,
    (g.lower.lat + g.upper.lat) / 2
  ]);
}

export function rectangle(g: GeoExtent): List<LngLat> {
  return List<LngLat>([g.lower, g.upper]);
}

export function polygon(g: GeoExtent): List<LngLat> {
  return List<LngLat>([
    genLngLat([g.lower.lon, g.lower.lat]),
    genLngLat([g.lower.lon, g.upper.lat]),
    genLngLat([g.upper.lon, g.upper.lat]),
    genLngLat([g.upper.lon, g.lower.lat]),
    genLngLat([g.lower.lon, g.lower.lat])
  ]);
}
export function area(g: GeoExtent): number {
  return Math.abs((g.upper.lon - g.lower.lon) * (g.upper.lat - g.lower.lat));
}

export function padByMeters(meters: number, g: GeoExtent) {
  const dLat = geoMetersToLat(meters);
  const dLon = geoMetersToLon(meters, center(g).lat);
  return geoExtent(
    genLngLat([g.lower.lon - dLon, g.lower.lat - dLat]),
    genLngLat([g.upper.lon + dLon, g.upper.lat + dLat])
  );
}

export function extend(extendTo: GeoExtent | LngLat, g: GeoExtent): GeoExtent {
  if (extendTo instanceof LngLat) return extend(geoExtent(extendTo), g);
  if (extendTo instanceof GeoExtent)
    return geoExtent(
      genLngLat([
        Math.min(extendTo.lower.lon, g.lower.lon),
        Math.min(extendTo.lower.lat, g.lower.lat)
      ]),
      genLngLat([
        Math.max(extendTo.upper.lon, g.upper.lon),
        Math.max(extendTo.upper.lat, g.upper.lat)
      ])
    );
}

export function _extend(extent: GeoExtent, g: GeoExtent) {
  return geoExtent(
    genLngLat([
      Math.min(extent.lower.lon, g.lower.lon),
      Math.min(extent.lower.lat, g.lower.lat)
    ]),
    genLngLat([
      Math.max(extent.upper.lon, g.upper.lon),
      Math.max(extent.upper.lat, g.upper.lat)
    ])
  );
}

export function contains(obj: GeoExtent | LngLat, g: GeoExtent): boolean {
  if (obj instanceof LngLat) obj = geoExtent(obj);
  if (obj instanceof GeoExtent)
    return (
      obj.lower.lon >= g.lower.lon &&
      obj.lower.lat >= g.lower.lat &&
      obj.upper.lon <= g.upper.lon &&
      obj.upper.lat <= g.upper.lat
    );
}

export function intersects(obj: GeoExtent | LngLat, g: GeoExtent): boolean {
  if (obj instanceof LngLat) obj = geoExtent(obj);
  if (obj instanceof GeoExtent)
    return (
      obj.lower.lon <= g.upper.lon &&
      obj.lower.lat <= g.upper.lat &&
      obj.upper.lon >= g.lower.lon &&
      obj.upper.lat >= g.lower.lat
    );
}

export function intersection(obj: GeoExtent | LngLat, g: GeoExtent): GeoExtent {
  if (obj instanceof LngLat) obj = geoExtent(obj);
  if (obj instanceof GeoExtent)
    return geoExtent(
      genLngLat([
        Math.max(obj.lower.lon, g.lower.lon),
        Math.max(obj.lower.lat, g.lower.lat)
      ]),
      genLngLat([
        Math.max(obj.upper.lon, g.upper.lon),
        Math.max(obj.upper.lat, g.upper.lat)
      ])
    );
}
//   intersection(obj) {
//     if (!this.intersects(obj)) return new geoExtent();
//     return new geoExtent(
//       [Math.max(obj[0][0], this[0][0]), Math.max(obj[0][1], this[0][1])],
//       [Math.min(obj[1][0], this[1][0]), Math.min(obj[1][1], this[1][1])]
//     );
//   }

//   intersects(obj) {
//     if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
//     return (
//       obj[0][0] <= this[1][0] &&
//       obj[0][1] <= this[1][1] &&
//       obj[1][0] >= this[0][0] &&
//       obj[1][1] >= this[0][1]
//     );
//   }
// export function geoExtent(min, max) {
//   if (!(this instanceof geoExtent)) return new geoExtent(min, max);
//   if (min instanceof geoExtent) {
//     return min;
//   } else if (
//     min &&
//     min.length === 2 &&
//     min[0].length === 2 &&
//     min[1].length === 2
//   ) {
//     this[0] = min[0];
//     this[1] = min[1];
//   } else {
//     this[0] = min || [Infinity, Infinity];
//     this[1] = max || min || [-Infinity, -Infinity];
//   }
// }

// export class GeoExtent extends Record({
//   min: genLngLat(),
//   max: genLngLat()
// }) {
//   min: LngLat;
//   max: LngLat;
//   extend(obj): GeoExtent {
//     return new GeoExtent(
//       [Math.min(obj[0][0], this.min.lon), Math.min(obj[0][1], this[0][1])],
//       [Math.max(obj[1][0], this[1][0]), Math.max(obj[1][1], this[1][1])]
//     );
//   }

//   _extend(extent) {
//     this[0][0] = Math.min(extent[0][0], this[0][0]);
//     this[0][1] = Math.min(extent[0][1], this[0][1]);
//     this[1][0] = Math.max(extent[1][0], this[1][0]);
//     this[1][1] = Math.max(extent[1][1], this[1][1]);
//   }

//   bbox() {
//     return {
//       minX: this[0][0],
//       minY: this[0][1],
//       maxX: this[1][0],
//       maxY: this[1][1]
//     };
//   }

//   contains(obj) {
//     if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
//     return (
//       obj[0][0] >= this[0][0] &&
//       obj[0][1] >= this[0][1] &&
//       obj[1][0] <= this[1][0] &&
//       obj[1][1] <= this[1][1]
//     );
//   }

//   intersects(obj) {
//     if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
//     return (
//       obj[0][0] <= this[1][0] &&
//       obj[0][1] <= this[1][1] &&
//       obj[1][0] >= this[0][0] &&
//       obj[1][1] >= this[0][1]
//     );
//   }

//   intersection(obj) {
//     if (!this.intersects(obj)) return new geoExtent();
//     return new geoExtent(
//       [Math.max(obj[0][0], this[0][0]), Math.max(obj[0][1], this[0][1])],
//       [Math.min(obj[1][0], this[1][0]), Math.min(obj[1][1], this[1][1])]
//     );
//   }

//   percentContainedIn(obj) {
//     if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
//     var a1 = this.intersection(obj).area(),
//       a2 = this.area();

//     if (a1 === Infinity || a2 === Infinity || a1 === 0 || a2 === 0) {
//       return 0;
//     } else {
//       return a1 / a2;
//     }
//   }

//   padByMeters(meters) {
//     var dLat = geoMetersToLat(meters),
//       dLon = geoMetersToLon(meters, this.center()[1]);
//     return geoExtent(
//       [this[0][0] - dLon, this[0][1] - dLat],
//       [this[1][0] + dLon, this[1][1] + dLat]
//     );
//   }

//   toParam() {
//     return this.rectangle().join(',');
//   }
// }
