import { ParentWays } from 'idly-common/lib/osm/structures';
import { Map as ImMap } from 'immutable';

export function dummyParentWaysGen(obj: any): ParentWays {
  return ImMap(obj);
}
