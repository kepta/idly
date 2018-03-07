import { baseId, Log, logGetLatestVersion } from '../dataStructures/log';

export function getLatestId(log: Log, id: string) {
  const bId = baseId(id);
  const version = logGetLatestVersion(id)(log);

  if (version === -1) {
    return id;
  }

  return `${bId}#${version}`;
}
