import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { Node, OsmGeometry } from 'idly-common/lib/osm/structures';

export const DEFAULT_NODE_ICON = 'circle';

export const nodePropertiesGen = ({ tags }: Node, parentSize: number = 0) => {
  const geometry = parentSize === 0 ? OsmGeometry.POINT : OsmGeometry.VERTEX;
  const match = presetMatch(tags, geometry);
  return {
    '@idly-geometry': geometry,
    '@idly-icon': (match && match.icon) || DEFAULT_NODE_ICON,
    '@idly-intersection': parentSize > 2,
    '@idly-name': tags.name,
  };
};
