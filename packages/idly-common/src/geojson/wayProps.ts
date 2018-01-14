import { weakCache } from '../misc/weakCache';
import {
  OsmGeometry,
  Way,
} from '../osm/structures';

import { isArea } from '../osm/isArea';
import { tagClassesPrimary } from '../tagClasses/tagClasses';
import { presetMatch } from './presetMatch';

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

export const wayPropertiesGen = weakCache((way: Way) => {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetMatch(way.tags, geometry); // presetsMatcherCached(geometry)(way.tags);
  return {
    name: way.tags.name || way.tags.ref,
    icon: match && match.icon,
    geometry,
    tagsClass,
    tagsClassType,
  };
});
