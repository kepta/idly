import { Map, Record } from 'immutable';

type Updater<T> = (value: T) => T;

// this is the source Type, your objects shape
interface ISourceType {
  readonly path: string;
  readonly error: string | null;
  readonly contents: Map<string, string>;
}

type PartialState = Partial<ISourceType>;
interface ITypedRecordType {
  get<K extends keyof ISourceType>(key: K): ISourceType[K];
  set<K extends keyof ISourceType>(
    key: K,
    value: ISourceType[K]
  ): ITypedRecordType;
  update<K extends keyof ISourceType>(
    key: K,
    updater: Updater<ISourceType[K]>
  ): ITypedRecordType;

  // Deep operations still need to be manually defined.
  getIn(keyPath: string[]): any | undefined;
  setIn(keyPath: string[], value: any): ITypedRecordType;
  deleteIn(keyPath: string[]): ITypedRecordType;

  withMutations(mutator: (s: ITypedRecordType) => any): ITypedRecordType;

  // Merge is made easy using typescript's new mapped types!!!
  merge(partial: PartialState): ITypedRecordType;
  mergeDeep(partial: PartialState): ITypedRecordType;
}

// Create the record class, using `State` to typecheck the default values.
// Remember that optional properties need to be explicitly specified as
// undefined or else the record won't acknowledge them down the line. For
// this reason I prefer using unions with null instead of optional
// properties.
const defaultState: ISourceType = {
  path: '',
  error: null,
  contents: Map()
};

const RecordClass = Record(defaultState, 'StateRecord');

// If this is top-level state, you may only want to expose initial state.

export const initialState = (new RecordClass() as any) as ITypedRecordType;
