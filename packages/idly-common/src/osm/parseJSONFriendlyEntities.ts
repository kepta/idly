import { deepFreeze } from '../misc/deepFreeze';
import { tagsFactory } from './tagsFactory';

import { Entity, Tags } from '../osm/structures';

export function parseJSONFriendlyEntities(entities: any): Entity[] {
  return entities.map((e: any) => {
    e.tags = tagsFactory(JSON.parse(e.tags));
    return deepFreeze(e);
  });
}
