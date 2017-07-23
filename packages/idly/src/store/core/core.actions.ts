import { action } from 'store/actions';

export const CORE = {
  newData: 'CORE.newData',
  removeIds: 'CORE.removeIds',
  modify: 'CORE.modify'
};

export interface IremoveEntitiesById {
  ids: string[];
}
export const removeEntitiesById = (ids: string[]) =>
  action(CORE.removeIds, { ids });
