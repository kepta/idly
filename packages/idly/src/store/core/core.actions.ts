import { List } from 'immutable/dist/immutable-nonambient';
import { action } from 'store/actions';

export const CORE = {
  newData: 'CORE.newData',
  addModified: 'CORE.addModified',
  removeIds: 'CORE.removeIds'
};

export interface IremoveEntitiesById {
  ids: List<string>;
}
