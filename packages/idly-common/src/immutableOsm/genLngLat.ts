import { $LngLat } from '../immutableOsm';
import { LngLat } from '../osm';
import { recordify } from 'typed-immutable-record';

export function $genLngLat(l: LngLat): $LngLat {
  return recordify<LngLat, $LngLat>(l);
}
