import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { weakCache } from 'idly-common/lib/misc/weakCache';
import { isArea } from 'idly-common/lib/osm/isArea';
import { OsmGeometry, Way } from 'idly-common/lib/osm/structures';
import { tagClasses } from 'idly-common/lib/tagClasses/tagClasses';
import { isOneway } from './isOneway';

export const wayPropertiesGen = (way: Way) => {
  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
  const allTagClasses = tagClasses(way.tags);

  const trimmed = Object.keys(allTagClasses).reduce(
    (prev, cur) => {
      prev['@idly-' + cur] = allTagClasses[cur];
      return prev;
    },
    {} as Record<string, string>
  );

  const match = presetMatch(way.tags, geometry); // presetsMatcherCached(geometry)(way.tags);
  const result: { [index: string]: string | boolean | number } = {
    '@idly-geometry': geometry,
    '@idly-icon': match && match.icon,
    '@idly-isOneway': isOneway(way.tags),
    '@idly-name': way.tags.name || way.tags.ref,
    ...trimmed,
  };

  if (way.tags.height) {
    result['@idly-height'] = parseInt(way.tags.height, 10);
    result['@idly-min_height'] = parseInt(way.tags.min_height, 10) || 0;
    if (
      way.tags['building:colour'] &&
      way.tags['building:colour'].length === 7
    ) {
      result['@idly-building-color'] = way.tags['building:colour'];
    }
  }

  return result;
};
