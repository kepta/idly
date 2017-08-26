import { Tags } from '../osm/structures';
import { $Tags } from '../immutableOsm/immutableOsm';
import { Map as $Map } from 'immutable';

export function $tagsFactory(t: Tags): $Tags {
  return $Map(t);
}
