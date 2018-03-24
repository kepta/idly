import { Tile } from '../geo';

export function quadkeyToTile(quadkey: string): Tile {
  let tileX = 0;
  let tileY = 0;
  const detail = quadkey.length;

  for (let i = detail; i > 0; i--) {
    const mask = 1 << (i - 1);
    const index = detail - i;
    switch (quadkey[index]) {
      case '0':
        break;
      case '1':
        tileX |= mask;
        break;
      case '2':
        tileY |= mask;
        break;
      case '3':
        tileX |= mask;
        tileY |= mask;
        break;
      default:
        throw new Error('Invalid quadkey');
    }
  }
  return {
    x: tileX,
    y: tileY,
    z: quadkey.length,
  };
}
