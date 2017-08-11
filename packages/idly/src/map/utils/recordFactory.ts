import { Record } from 'immutable';

type Updater<T> = (value: T) => T;
/**
 * This generates a record constructor which is
 * typed strong.:)
 */

export interface IRecord<T> {
  get<K extends keyof T>(key: K): T[K];
  set<K extends keyof T>(key: K, value: T[K]): IRecord<T>;
  update<K extends keyof T>(key: K, updater: Updater<T[K]>): IRecord<T>;

  // Deep operations still need to be manually defined.
  getIn(keyPath: Array<number | string>, notSet?: any): any | undefined;
  setIn(keyPath: string[], value: any): IRecord<T>;
  deleteIn(keyPath: string[]): IRecord<T>;

  withMutations(mutator: (s: IRecord<T>) => any): IRecord<T>;

  // Merge is made easy using typescript's new mapped types!!!
  merge(partial: Partial<T>): IRecord<T>;
  mergeDeep(partial: Partial<T>): IRecord<T>;

  equals(other: IRecord<T>): boolean;
  toJS(): any;
}
export function recordFactory<T>(defaultState: T, recordName?: string) {
  const RecordClass = Record(defaultState, recordName);
  interface IConstructor<TInput> {
    (input: TInput): IRecord<T>;
    new (input: TInput): IRecord<T>;
  }
  return (RecordClass as any) as IConstructor<T>;
}
