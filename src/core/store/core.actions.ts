import { List } from 'immutable';


export const CORE = {
  newData: 'CORE.newData',
  addModified: 'CORE.addModified',
  removeIds: 'CORE.removeIds'
};

export interface IremoveEntitiesById {
  ids: List<string>;
}
