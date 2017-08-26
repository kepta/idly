import { Geometry } from 'osm/entities/constants';
import { Tags } from 'osm/entities/helpers/tags';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { ParentWays } from 'osm/parsers/parsers';
import { areaKeys } from 'osm/presets/presets';
import { weakCache } from 'utils/weakCache';

const findInAreaKeys = weakCache((tags: Tags) => {
  const keys = tags.keySeq();
  let found = false;
  tags.forEach((v, key) => {
    if (areaKeys.has(key) && !areaKeys.hasIn([key, v])) {
      found = true;
      return false;
    }
  });
  return found;
});
/**
 * @NOTE
 *  The way osm works is that it will give you everything inside the bbox
 *   but only a secondary level outside the bbox. So if the a node is
 *   currently a vertex, it could become a vertex_shared in future.
 *   thats why parentWays is updated on every network request.
 */
export function getNodeGeometry(id, parentWays: ParentWays) {
  if (parentWays.has(id))
    return parentWays.get(id).size > 1
      ? Geometry.VERTEX_SHARED
      : Geometry.VERTEX;
  return Geometry.POINT;
}

export const getWayGeometry = (way: Way) =>
  isArea(way) ? Geometry.AREA : Geometry.LINE;

export const isArea = weakCache((way: Way) => {
  if (way.tags.get('area') === 'yes') return true;
  if (!isClosed(way) || way.tags.get('area') === 'no') return false;
  return findInAreaKeys(way.tags);
});

function isMultipolygon(entity: Relation) {
  return false;
}

export function isClosed(entity: Way) {
  return entity.nodes.size > 1 && entity.nodes.first() === entity.nodes.last();
}
