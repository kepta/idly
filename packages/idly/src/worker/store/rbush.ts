import { BBox } from '@turf/helpers';

import { mercator } from 'idly-common/lib/geo/sphericalMercator';
import { Tile } from 'idly-common/lib/geo/tile';

import * as rbush from 'rbush';

export interface TreeData extends rbush.BBox {
  xyz: Tile;
}
export class RbushCache {
  private tree = rbush<TreeData>(3);
  insert(tile: Tile) {
    const [minX, minY, maxX, maxY] = mercator.bbox(tile.x, tile.y, tile.z);
    const bbox: TreeData = {
      minX,
      minY,
      maxX,
      maxY,
      xyz: tile
    };
    return this.tree.insert(bbox);
  }
  // @NOTE rbush bbox {minX..} is not the same
  //  as turf bbox [minX...]
  search([minX, minY, maxX, maxY]: BBox): TreeData[] {
    return this.tree.search({
      minX,
      minY,
      maxX,
      maxY
    });
  }
}
