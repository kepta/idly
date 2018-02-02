import { Tile } from 'idly-common/lib/geo';

export let tileId = ({ x, y, z }: Tile) => `${x}-${y}-${z}`;
