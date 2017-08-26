import { $Attributes } from '../immutableOsm';
import { Attributes } from '../osm';
import { recordify } from 'typed-immutable-record';

export function $attributesGen(attr: Attributes): $Attributes {
  return recordify<Attributes, $Attributes>(attr);
}
