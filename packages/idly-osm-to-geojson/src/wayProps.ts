import { weakCache } from 'idly-common/lib/misc/weakCache';
import { OsmGeometry, Way } from 'idly-common/lib/osm/structures';
import { isArea } from 'idly-common/lib/osm/isArea';
import { tagClassesPrimary } from 'idly-common/lib/tagClasses/tagClasses';
import { presetMatch } from 'idly-common/lib/geojson/presetMatch';

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

export const wayPropertiesGen = weakCache((way: Way) => {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetMatch(way.tags, geometry); // presetsMatcherCached(geometry)(way.tags);
  return {
    geometry,
    icon: match && match.icon,
    name: way.tags.name || way.tags.ref,
    tagsClass,
    tagsClassType,
  };
});
