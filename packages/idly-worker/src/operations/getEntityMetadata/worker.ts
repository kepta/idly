import {
  EntityType,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { nodePresetMatch } from 'idly-osm-to-geojson/lib/nodeFeatures/nodePresetMatch';
import { relationPresetMatch } from 'idly-osm-to-geojson/lib/relationFeatures/relationPresetMatch';
import { Derived } from 'idly-osm-to-geojson/lib/types';
import { wayPresetMatch } from 'idly-osm-to-geojson/lib/wayFeatures/wayPresetMatch';
import { WorkerOperation, WorkerState } from '../helpers';
import { GetEntityMetadata } from './type';

export function workerGetEntityMetadata(
  state: WorkerState
): WorkerOperation<GetEntityMetadata> {
  return async ({ id }) => {
    const rawDerived = state.osmState.derivedTable.get(id);
    const metadata = {
      entity: rawDerived ? rawDerived.entity : undefined,
      parentRelations: rawDerived ? [...rawDerived.parentRelations] : [],
      parentWays: rawDerived ? [...rawDerived.parentWays] : [],
      preset: presetCalc(rawDerived),
    };
    return {
      response: metadata,
      state,
    };
  };
}

function presetCalc(d?: Derived): { name: string } | undefined {
  if (!d) {
    return undefined;
  }

  let match;

  if (d.entity.type === EntityType.RELATION) {
    match = relationPresetMatch(d as Derived<Relation>).match;
  } else if (d.entity.type === EntityType.WAY) {
    match = wayPresetMatch(d as Derived<Way>).match;
  } else if (d.entity.type === EntityType.NODE) {
    match = nodePresetMatch(d as Derived<Node>).match;
  }

  if (!match) {
    return undefined;
  }

  return {
    name: match.name({}),
  };
}
