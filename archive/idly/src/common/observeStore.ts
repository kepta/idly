import { IRootStateType } from 'common/store';
export const observeStore = (store: any) => (
  selector: (s: IRootStateType) => any,
  onChange,
  shouldUpdate
) => {
  let currentState;
  function handleChange() {
    const nextState = selector(store.getState());
    if (shouldUpdate(nextState, currentState)) {
      currentState = nextState;
      console.log('sending', currentState);
      onChange(currentState, store.dispatch);
    }
  }
  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};
