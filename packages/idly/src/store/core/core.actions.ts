import { action } from 'store/actions';

export const CORE = {
  newData: 'CORE.newData',
  removeIds: 'CORE.removeIds',
  addModified: 'CORE.addModified'
};

export interface IremoveEntitiesById {
  ids: string[];
}
export const removeEntitiesById = (ids: string[]) =>
  action(CORE.removeIds, { ids });
