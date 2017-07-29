import { List } from 'immutable';

import { action } from 'common/actions';

export const CORE = {
  newData: 'CORE.newData',
  addModified: 'CORE.addModified',
  removeIds: 'CORE.removeIds'
};

export interface IremoveEntitiesById {
  ids: List<string>;
}
