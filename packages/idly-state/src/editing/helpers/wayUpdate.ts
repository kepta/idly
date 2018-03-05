import { wayFactory } from 'idly-common/lib/osm/entityFactory';
import { Way } from 'idly-common/lib/osm/structures';
import { wayClone } from './wayClone';

export function wayUpdate(
  obj: Partial<Way> & { id: string },
  unsafeWay: Way
): Way {
  const way = wayClone(unsafeWay);
  return wayFactory(Object.assign({}, way, obj));
}
