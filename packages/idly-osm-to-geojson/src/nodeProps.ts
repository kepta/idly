import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { Node, OsmGeometry } from 'idly-common/lib/osm/structures';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = ({ tags }: Node, geometry: OsmGeometry) => {
  const match = presetMatch(tags, geometry);
  return {
    '@idly-geometry': geometry,
    '@idly-icon': (match && match.icon) || DEFAULT_NODE_ICON,
    '@idly-name': tags.name,
  };
};
