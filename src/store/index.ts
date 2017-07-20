import { fromJS, List, Map } from 'immutable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { osmReducer, OsmTilesState } from 'src/store/osm_tiles/reducer';
import { rootSaga } from 'src/store/run_sagas';
// Reducers
// Sagas

export interface IRootStateType {
  osmTiles: OsmTilesState;
}

// Root reducer
const reducers = combineReducers({
  osmTiles: osmReducer
});

const sagaMiddleware = createSagaMiddleware();

// Middlewares
const middlewares = [sagaMiddleware];

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
export { store };
