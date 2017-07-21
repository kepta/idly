import { IRootStateType } from 'store/index';

export const observeStore = (store: any) => (
  selector: (s: IRootStateType) => any,
  onChange
) => {
  let currentState;
  function handleChange() {
    const nextState = selector(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState, store.dispatch);
    }
  }
  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

// export const observeStore = (store: any) => (
//   selector: (s: IRootStateType) => any,
//   actions,
//   c
// ) => (...args) => {
//   let currentState;
//   let bindedActions = {};
//   const target = new c(...args);
//   const unsubscribe = store.subscribe(handleChange);
//   for (let [k, v] of actions) {
//     bindedActions[k] = store.dispatch.bind(v);
//   }
//   function handleChange() {
//     const nextState = selector(store.getState());
//     if (nextState !== currentState) {
//       currentState = nextState;
//       target.receiveProps(currentState, bindedActions, unsubscribe);
//     }
//   }
//   handleChange();
//   return target;
// };
