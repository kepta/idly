import { Map as $Map } from "immutable";
import { $Tags } from "../immutableOsm/immutableOsm";
import { Tags } from "../osm/structures";

export function $tagsFactory(t: Tags): $Tags {
  return $Map(t);
}
