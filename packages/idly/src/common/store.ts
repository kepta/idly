import { Set } from 'immutable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
// import { watchCore } from '../core/store/core.sagas';
import { selectReducer, SelectState } from '../select/store/select.reducer';

// import { coreReducer, CoreState } from 'core/store/core.reducer';
// import { drawReducer, DrawState } from 'draw/store/draw.reducer';
// import { watchDraw } from 'draw/store/draw.sagas';
import { osmReducer, OsmTilesState } from 'map/store/map.reducer';
import { watchOSMTiles } from 'map/store/map.sagas';
import { observeStore } from 'common/observeStore';
import { all, call } from 'redux-saga/effects';
import { watchSelect } from '../select/store/select.saga';
// Reducers
// Sagas

export interface IRootStateType {
  osmTiles: OsmTilesState;
  select: SelectState;

  // core: CoreState;
  // draw: DrawState;
}

// Root reducer
const reducers = combineReducers({
  osmTiles: osmReducer,
  // core: coreReducer,
  // draw: drawReducer,
  select: selectReducer
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

function* rootSaga() {
  yield all([
    call(watchOSMTiles),
    // call(watchDraw),
    // call(watchCore),
    call(watchSelect)
  ]);
}

sagaMiddleware.run(rootSaga).done.catch(e => {
  console.error(e);
});
export const observe = observeStore(store);
export { store };
