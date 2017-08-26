import { recordify } from "typed-immutable-record";
import { $Attributes } from "../immutableOsm/immutableOsm";
import { Attributes } from "../osm/structures";

export function $attributesGen(attr: Attributes): $Attributes {
  return recordify<Attributes, $Attributes>(attr);
}
