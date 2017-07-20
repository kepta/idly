export function geoMetersToLat(m) {
  return m / 110946.257617;
}

// using WGS84 equatorial radius (6378137.0 m)
// const = 2 * PI * r / 360
export function geoMetersToLon(m, atLat) {
  return Math.abs(atLat) >= 90
    ? 0
    : m / 111319.490793 / Math.abs(Math.cos(atLat * (Math.PI / 180)));
}
