import { Map, Record } from 'immutable';

export type Updater<T> = (value: T) => T;

// this is the source Type, your objects shape

// export type PartialState = Partial<ISourceType>;

export interface ITypedRecordType<ISourceType> {
  get<K extends keyof ISourceType>(key: K): ISourceType[K];
  set<K extends keyof ISourceType>(
    key: K,
    value: ISourceType[K]
  ): ITypedRecordType<ISourceType>;
  update<K extends keyof ISourceType>(
    key: K,
    updater: Updater<ISourceType[K]>
  ): ITypedRecordType<ISourceType>;

  // Deep operations still need to be manually defined.
  getIn(keyPath: string[]): any | undefined;
  setIn(keyPath: string[], value: any): ITypedRecordType<ISourceType>;
  deleteIn(keyPath: string[]): ITypedRecordType<ISourceType>;

  withMutations(
    mutator: (s: ITypedRecordType<ISourceType>) => any
  ): ITypedRecordType<ISourceType>;

  // Merge is made easy using typescript's new mapped types!!!
  merge(partial: Partial<ISourceType>): ITypedRecordType<ISourceType>;
  mergeDeep(partial: Partial<ISourceType>): ITypedRecordType<ISourceType>;
}

// Create the record class, using `State` to typecheck the default values.
// Remember that optional properties need to be explicitly specified as
// undefined or else the record won't acknowledge them down the line. For
// this reason I prefer using unions with null instead of optional
// properties.

// If this is top-level state, you may only want to expose initial state.

export const genTypedRecord = <T>(
  defaultState: T,
  name: string = 'TypedRecord'
) => {
  const RecordClass = Record(defaultState, name);
  //   const defaultState: ISourceType = {
  //     path: '',
  //     error: null,
  //     contents: Map()
  //   };
  type MergedType = T & ITypedRecordType<T>;
  return (new RecordClass() as any) as MergedType;
};

// export interface T {
//   readonly path: string;
//   readonly error: string | null;
//   //   readonly contents: Map<string, string>;
// }

// var x = initialState<T>({ path: 'ss', error: '2' });
