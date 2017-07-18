export type Action<T> = T & {
  type: string;
};

export function action<T extends object>(type: string, payload: T): Action<T> {
  return Object.assign({ type }, payload);
}
