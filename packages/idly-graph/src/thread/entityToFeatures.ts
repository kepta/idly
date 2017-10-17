import { Feature } from 'idly-common/lib/osm/feature';
import { EntityTable, FeaturePropsTable, ParentWays } from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';
import { entityToGeoJSON } from '../misc/entityToGeoJSON';

export type PluginComputeProps = (
  entityTable: EntityTable,
  parentWays: ParentWays,
) => FeaturePropsTable;

export function entityToFeature(
  computer: PluginComputeProps[],
): (
  entityTable: EntityTable,
  parentWays?: ParentWays,
) => Array<Feature<any, any>> {
  return (entityTable, parentWays = calculateParentWays(entityTable)) => {
    const props = new Map();
    for (const comp of computer) {
      const computedProps = comp(entityTable, parentWays);
      for (const [entityId, val] of computedProps) {
        if (props.has(entityId)) {
          props.get(entityId).push(val);
        } else {
          props.set(entityId, [val]);
        }
      }
    }
    for (const [key, val] of props) {
      props.set(key, Object.assign({}, ...val));
    }
    return entityToGeoJSON(entityTable, props);
  };
}
