import { Record } from 'immutable';

export class Properties extends Record({
  visible: true,
  version: 0,
  timestamp: undefined,
  changeset: undefined,
  uid: undefined,
  user: undefined,
  geometry: undefined
}) {
  public visible?: boolean;
  public version?: number;
  public timestamp?: string;
  public changeset?: string;
  public uid?: string;
  public user?: string;
  public geometry?: Geometries;
}

export function propertiesGen(obj?: {
  visible?: boolean;
  version?: number;
  timestamp?: string;
  changeset?: string;
  uid?: string;
  user?: string;
  geometry?: Geometries;
}) {
  return new Properties(obj);
}
