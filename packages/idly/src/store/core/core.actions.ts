import { action } from 'store/actions';

export const CORE = {
  newData: 'CORE.newData',
  removeIds: 'Core.removeIds'
};

export interface IremoveEntitiesById {
  ids: string[];
}
export const removeEntitiesById = (ids: string[]) =>
  action(CORE.removeIds, { ids });
