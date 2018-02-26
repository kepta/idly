import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { weakCache } from 'idly-common/lib/misc/weakCache';
import { isArea } from 'idly-common/lib/osm/isArea';
import { OsmGeometry, Way } from 'idly-common/lib/osm/structures';
import { tagClassesPrimary } from 'idly-common/lib/tagClasses/tagClasses';
import { isOneway } from './isOneway';

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

export const wayPropertiesGen = weakCache((way: Way) => {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetMatch(way.tags, geometry); // presetsMatcherCached(geometry)(way.tags);
  const result = {
    '@idly-geometry': geometry,
    '@idly-icon': match && match.icon,
    '@idly-isOneway': isOneway(way.tags),
    '@idly-name': way.tags.name || way.tags.ref,
    '@idly-tagsClass': tagsClass,
    '@idly-tagsClassType': tagsClassType,
  };
  if (way.tags.height) {
    result['@idly-height'] = parseInt(way.tags.height, 10);
    result['@idly-min_height'] = parseInt(way.tags['min_height'], 10);
  }
  return result;
});
