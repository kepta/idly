import { Tags } from '../osm';
import { $Tags } from '../immutableOsm';
import { Map as $Map } from 'immutable';

export function $tagsFactory(t: Tags): $Tags {
  return $Map(t);
}
