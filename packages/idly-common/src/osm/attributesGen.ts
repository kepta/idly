import { Attributes } from "../osm/structures";

export function attributesGen({
  visible,
  version,
  timestamp,
  changeset,
  uid,
  user,
}: {
  visible?: boolean;
  version?: number;
  timestamp?: string;
  changeset?: string;
  uid?: string;
  user?: string;
}): Attributes {
  return {
    visible,
    version,
    timestamp,
    changeset,
    uid,
    user,
  };
}
