import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { weakCache } from 'idly-common/lib/misc/weakCache';
import { isArea } from 'idly-common/lib/osm/isArea';
import { OsmGeometry, Way } from 'idly-common/lib/osm/structures';
import { tagClassesPrimary } from 'idly-common/lib/tagClasses/tagClasses';

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

export const wayPropertiesGen = weakCache((way: Way) => {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetMatch(way.tags, geometry); // presetsMatcherCached(geometry)(way.tags);
  return {
    '@idly-geometry': geometry,
    '@idly-icon': match && match.icon,
    '@idly-name': way.tags.name || way.tags.ref,
    '@idly-tagsClass': tagsClass,
    '@idly-tagsClassType': tagsClassType,
  };
});
