import { EntityTable, OsmGeometry, Way, weakCache } from 'idly-common/lib';

import { isArea } from '../helpers/isArea';
import { tagClassesPrimary } from '../tagClasses/tagClasses';
import { presetsMatcherCached } from '../presets/presets';

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

export function wayPropertiesGen(way: Way, table: EntityTable) {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetsMatcherCached(geometry)(way.tags);
  return {
    name: way.tags.get('name') || way.tags.get('ref'),
    icon: match && match.icon,
    geometry,
    tagsClass,
    tagsClassType
  };
}
