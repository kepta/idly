import { OsmGeometry, Way, EntityType } from 'idly-common/lib/osm/structures';

import { isArea } from '../helpers/isArea';

export const getWayGeometry = (way: Way) =>
  isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
