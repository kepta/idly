import { OsmGeometry, Way } from 'idly-common/lib';

import { isArea } from '../helpers/isArea';

export const getWayGeometry = (way: Way) =>
  isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;
