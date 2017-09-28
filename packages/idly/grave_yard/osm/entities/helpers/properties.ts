import { Record } from 'immutable';

export class Properties extends Record({
  visible: true,
  version: 0,
  timestamp: undefined,
  changeset: undefined,
  uid: undefined,
  user: undefined
}) {
  readonly visible?: boolean;
  readonly version?: number;
  readonly timestamp?: string;
  readonly changeset?: string;
  readonly uid?: string;
  readonly user?: string;
}

export function propertiesGen(obj?: {
  visible?: boolean;
  version?: number;
  timestamp?: string;
  changeset?: string;
  uid?: string;
  user?: string;
}) {
  return new Properties(obj);
}
