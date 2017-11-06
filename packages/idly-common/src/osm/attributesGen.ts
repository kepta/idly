import { Attributes } from '../osm/structures';
const attr = {};

export function attributesGen(
  {
    visible,
    version,
    timestamp,
    changeset,
    uid,
    user
  }: {
    visible?: boolean;
    version?: string;
    timestamp?: string;
    changeset?: string;
    uid?: string;
    user?: string;
  } = {}
): Attributes {
  return {
    changeset,
    timestamp,
    uid,
    user,
    version,
    visible
  };
}
