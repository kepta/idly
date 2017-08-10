import { List, Set } from 'immutable';

import { ILayerSpec } from 'map/layers/layerFactory';
import { setSubtractEntities } from 'map/utils/setSubtract';
import { Entities } from 'osm/entities/entities';

export function isList(x: string | List<any>): x is List<any> {
  return List.isList(x);
}

const findNotInId = n => isList(n) && n.get(0) === '!in' && n.get(1) === 'id';

export function hideEntities(
  layer: ILayerSpec,
  oldEntities: Entities,
  newEntities: Entities
) {
  return layer.update('filter', filter => {
    const addedEntities = setSubtractEntities(newEntities, oldEntities);
    const index = filter.findIndex(findNotInId);
    if (addedEntities.size > 0) {
      if (index === -1) return filter;
      return filter.remove(index);
    }
    const removedEntities = setSubtractEntities(oldEntities, newEntities);
    if (removedEntities.size > 0) {
      const toRemove = removedEntities.map(e => e.id);
      const target = List(['!in', 'id']).concat(toRemove).toList();
      if (index === -1) {
        return filter.push(target);
      }

      return filter.update(index, (t: List<string>) => {
        return t.concat(toRemove).toOrderedSet().toList();
      });
    }
    return filter;
  });
}
