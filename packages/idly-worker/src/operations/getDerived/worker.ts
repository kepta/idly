import { Derived } from 'idly-osm-to-geojson/lib';
import { WorkerOperation, WorkerState } from '../helpers';
import { GetDerived } from './type';

export function workerGetDerived(
  state: WorkerState
): WorkerOperation<GetDerived> {
  return async ({ id }) => {
    let derived;
    if (state.osmState.derivedTable.has(id)) {
      const rawDerived = state.osmState.derivedTable.get(id) as Derived;
      derived = {
        entity: rawDerived.entity,
        parentRelations: [...rawDerived.parentRelations],
        parentWays: [...rawDerived.parentWays],
      };
    }
    return {
      response: {
        derived,
      },
      state,
    };
  };
}
