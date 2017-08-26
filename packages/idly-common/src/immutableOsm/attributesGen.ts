import { $Attributes } from '../immutableOsm/immutableOsm';
import { Attributes } from '../osm/structures';
import { recordify } from 'typed-immutable-record';

export function $attributesGen(attr: Attributes): $Attributes {
  return recordify<Attributes, $Attributes>(attr);
}
