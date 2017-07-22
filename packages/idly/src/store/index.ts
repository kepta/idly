import { fromJS, List, Map } from 'immutable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
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
const logger = store => next => action => {
  console.groupCollapsed(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const middlewares = [
  // logger,
  sagaMiddleware
];

let appliedMiddlewares = applyMiddleware(...middlewares);
if (process.env.NODE_ENV !== 'production') {
  const { composeWithDevTools } = require('redux-devtools-extension');
  appliedMiddlewares = composeWithDevTools(appliedMiddlewares);
}

// Persisted state
const persistedState = {};

// Store
const store = createStore(reducers, persistedState, appliedMiddlewares);

sagaMiddleware.run(rootSaga);
export const observe = observeStore(store);
export { store };
