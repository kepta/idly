import { ParentWays } from 'idly-common/lib/osm/structures';
import { ImMap } from 'idly-common/lib/misc/immutable';

export function dummyParentWaysGen(obj: any): ParentWays {
  return ImMap(obj);
}
