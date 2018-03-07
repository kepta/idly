import { baseId, logGetLatestVersion } from '../dataStructures/log';
import { OsmState } from '../type';
import { getEntity } from './getEntity';

export function genNextId(state: OsmState, id: string): string {
  const virginId = baseId(id);
  const genId = (version: number) => `${virginId}#${version}`;
  let nextVersion = logGetLatestVersion(id)(state.log) + 1;

  while (getEntity(genId(nextVersion), state)) {
    nextVersion++;
  }
  return genId(nextVersion);
}
