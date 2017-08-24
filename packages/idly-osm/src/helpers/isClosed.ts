import { Way } from 'idly-common/lib';

export function isClosed(entity: Way) {
  return (
    entity.nodes.length > 1 &&
    entity.nodes[0] === entity.nodes[entity.nodes.length - 1]
  );
}
