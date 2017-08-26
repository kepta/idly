import { recordify } from "typed-immutable-record";
import { $LngLat } from "../immutableOsm/immutableOsm";
import { LngLat } from "../osm/structures";

export function $genLngLat(l: LngLat): $LngLat {
  return recordify<LngLat, $LngLat>(l);
}
