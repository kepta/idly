import { Set } from 'immutable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { coreReducer, CoreState } from '../core/store/core.reducer';

import { observeStore } from 'common/observeStore';
import { all, call } from 'redux-saga/effects';
import { watchSelect } from '../core/store/core.saga';

export interface IRootStateType {
  core: CoreState;
}

// Root reducer
const reducers = combineReducers({
  // core: coreReducer,
  // draw: drawReducer,
  core: coreReducer
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
  yield all([call(watchSelect)]);
}

sagaMiddleware.run(rootSaga).done.catch(e => {
  console.error(e);
});
export const observe = observeStore(store);
export { store };
