import { Entity } from 'idly-common/lib/osm/structures';
import { baseId, modifiedIdGetVersion } from '../../../log';

export const simpleIdIncr = (r: Entity) => {
  const id = baseId(r.id);
  let version = modifiedIdGetVersion(r.id);
  if (!(version > -1)) {
    version = 0;
  }
  return `${id}#${version}`;
};
