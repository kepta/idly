import { Record } from 'immutable';

var base = Record({
  visible: true,
  version: 0,
  timeStamp: undefined,
  changeset: undefined,
  uid: undefined,
  username: undefined
});

export class Properties extends base {
  visible?: boolean;
  version?: number;
  timeStamp?: string;
  changeset?: string;
  uid?: string;
  username?: string;
}

export function propertiesGen(obj?: {
  visible?: boolean;
  version?: number;
  timeStamp?: string;
  changeset?: string;
  uid?: string;
  username?: string;
}) {
  return new Properties(obj);
}
