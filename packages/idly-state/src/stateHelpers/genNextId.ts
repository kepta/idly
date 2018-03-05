import { baseId, logGetLatestVersion } from '../log';
import { OsmState } from '../type';
import { getEntity } from './getEntity';

export function genNextId(id: string, state: OsmState): string {
  const virginId = baseId(id);
  const genId = (version: number) => `${virginId}#${version}`;
  let nextVersion = logGetLatestVersion(id)(state.log) + 1;

  while (getEntity(genId(nextVersion), state)) {
    nextVersion++;
  }
  return genId(nextVersion);
}
