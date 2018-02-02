import { Tile } from '../geo/Tile';

/**
 * Get the quadkey for a tile
 *
 * @name tileToQuadkey
 * @param {Array<number>} tile
 * @returns {string} quadkey
 * @example
 * var quadkey = tileToQuadkey([0, 1, 5])
 * //=quadkey
 */
export function tileToQuadkey(tile: Tile) {
  let index = '';
  for (let z = tile.z; z > 0; z--) {
    let b = 0;
    const mask = 1 << (z - 1);
    if ((tile.x & mask) !== 0) {
      b++;
    }
    if ((tile.y & mask) !== 0) {
      b += 2;
    }
    index += b.toString();
  }
  return index + '';
}
