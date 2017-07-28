import { fromJS, List, Map, Set } from 'immutable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import { coreReducer, CoreState } from 'store/core/core.reducer';
import { drawReducer, DrawState } from 'store/draw/draw.reducer';
import { osmReducer, OsmTilesState } from 'store/map/reducer';
import { observeStore } from 'store/observe';
import { rootSaga } from 'store/run_sagas';

// Reducers
// Sagas

export interface IRootStateType {
  osmTiles: OsmTilesState;
  core: CoreState;
  draw: DrawState;
}

// Root reducer
const reducers = combineReducers({
  osmTiles: osmReducer,
  core: coreReducer,
  draw: drawReducer
});

const sagaMiddleware = createSagaMiddleware();

// Middlewares
const logger = state => next => action => {
  console.groupCollapsed(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', state.getState());
  console.groupEnd();
  return result;
};

const middlewares = [
  //
  // logger,
  sagaMiddleware
];

let appliedMiddlewares = applyMiddleware(...middlewares);
if (process.env.NODE_ENV !== 'production') {
  // const { composeWithDevTools } = require('redux-devtools-extension');
  const cc = composeWithDevTools as any;
  const composeEnhancers = cc({
    serialize: {
      replacer: (key, value) => {
        if (Set.isSet(value)) {
          return {
            data: value.size,
            __serializedType__: 'Set'
          };
        }
        return value;
      }
    }
  });
  appliedMiddlewares = composeEnhancers(appliedMiddlewares);
}

// Persisted state
const persistedState = {};

// Store
const store = createStore(reducers, persistedState, appliedMiddlewares);

sagaMiddleware.run(rootSaga).done.catch(e => {
  console.error(e);
});
export const observe = observeStore(store);
export { store };
