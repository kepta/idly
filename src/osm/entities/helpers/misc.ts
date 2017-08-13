import { Geometry } from 'osm/entities/constants';
import { Entity } from 'osm/entities/entities';
import { Tags } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { AreaKeys } from 'osm/presets/areaKeys';
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
