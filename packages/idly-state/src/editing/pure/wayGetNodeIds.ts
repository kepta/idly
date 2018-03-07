import { Entity, EntityType, Way } from 'idly-common/lib/osm/structures';

export function waysGetNodeIds(e: Entity): Way['nodes'] {
  return e.type === EntityType.WAY ? e.nodes : [];
}
