import { presetMatch } from './presetsInit';
import { weakCache } from 'idly-common/lib/misc/weakCache';
import {
  EntityTable,
  EntityType,
  OsmGeometry,
  Tags,
  Way
} from 'idly-common/lib/osm/structures';

import { isArea } from '../helpers/isArea';
import { tagClassesPrimary } from '../tagClasses/tagClasses';

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

export const wayPropertiesGen = weakCache((way: Way) => {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetMatch(way.tags, geometry); //presetsMatcherCached(geometry)(way.tags);
  return {
    name: way.tags['name'] || way.tags['ref'],
    icon: match && match.icon,
    geometry,
    tagsClass,
    tagsClassType
  };
});
