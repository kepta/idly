import { wayFactory } from 'idly-common/lib/osm/entityFactory';
import { Attributes, Tags, Way } from 'idly-common/lib/osm/structures';

export function wayClone(way: Way): Way {
  return wayFactory({
    attributes: { ...way.attributes },
    id: way.id,
    nodes: way.nodes.slice(),
    tags: { ...way.tags },
  });
}
