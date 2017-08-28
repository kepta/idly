import { Map as $Map, Set as $Set } from 'immutable';

import { Entities, Entity, EntityId } from 'idly-common/lib/osm/structures';

import { Feature } from 'idly-common/lib/osm/feature';

import { SelectActions, SelectActionType } from './select.actions';

export interface SelectState {
  readonly features: $Map<EntityId, Feature<any, any>>;
  readonly entities: $Map<EntityId, Entity>;
}

const selectState: SelectState = {
  features: $Map(),
  entities: $Map()
};

export function selectReducer(state = selectState, action: SelectActionType) {
  switch (action.type) {
    case SelectActions.COMMIT: {
      const { features, entities } = action;
      return {
        features: $Map(features.map(f => [f.id, f])),
        entities: $Map(entities.map(e => [e.id, e]))
      };
    }
    default: {
      return state;
    }
  }
}
