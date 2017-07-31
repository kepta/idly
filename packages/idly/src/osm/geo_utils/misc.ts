import { remove as removeDiacritics } from 'diacritics';

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

export function utilEditDistance(a, b) {
  a = removeDiacritics(a.toLowerCase());
  b = removeDiacritics(b.toLowerCase());
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1
          )
        ); // deletion
      }
    }
  }
  return matrix[b.length][a.length];
}
