import { weakCache } from '../../misc/weakCache';
import {
  setCreate,
  setFind,
  setIntersect,
  setSome,
  iterableFlattenToSet,
} from '../helper';
/**
 * The log is used as [...modifiedEntries, virginOsmEntries]
 * the pointer to virginOsmEntries resolves to EntityTable
 * we carefully mutate virginOsmEntries keeping the pointer same.
 *
 * modified entities are id#version where version [0, infinity) (0 is inclusive)
 */

export type ModifiedId = string;

export type Log = ReadonlyArray<Entry>;

export type Entry = ReadonlySet<string>;

export const validVirginId = (str: string) => str.indexOf('#') === 0;

export const validModifiedId = (str: string) => !validVirginId(str);

export const logGetVirginIdsOfModifiedIds = weakCache((log: Log) =>
  log.reduce((prev: Set<string>, cur) => {
    cur.forEach(index => prev.add(modifiedIdGetVirginId(index)));
    return prev;
  }, setCreate())
);

export const logGetLatestModifiedIds = weakCache(
  (log: Log) =>
    new Set(
      log
        .reduce((prev, cur) => {
          cur.forEach(
            index =>
              !prev.has(modifiedIdGetVirginId(index)) &&
              prev.set(modifiedIdGetVirginId(index), index)
          );
          return prev;
        }, new Map<string, string>())
        .values()
    )
);

export const logGetEverything = weakCache((log: Log) =>
  iterableFlattenToSet<string>(log)
);

export const logRecreate = (...entries: Entry[]) =>
  entries
    .slice(0)
    .reverse()
    .reduce((l, e) => {
      const newLog = logAddEntry(e)(l);
      if (l === newLog) {
        throw new Error('malformed entries');
      }
      return newLog;
    }, logCreate());

export const logCreate = (): Log => Object.freeze([]);

export const doesLogContain = (entry: Entry) => (log: Log) =>
  log.some(e => setIntersect(entry, e).size > 0);

export const logAddEntry = (entry: Entry) => (log: Log) =>
  setSome(index => doesLogHaveNewerOrCurrentVersion(index)(log), entry)
    ? log
    : Object.freeze([entry, ...log]);

export const doesLogHaveNewerOrCurrentVersion = (index: string) => (log: Log) =>
  logGetLatestVersion(index)(log) >= modifiedIdGetVersion(index);

export const modifiedIdGetVersion = (index: ModifiedId) =>
  parseInt(modifiedIdParse(index)[1], 10);

export const logGetLatestVersion = (id: string) => (log: Log) => {
  const finder = entryFindModifiedId(modifiedIdGetVirginId(id));
  let index;
  for (const entry of log) {
    index = finder(entry);
    if (index) {
      return modifiedIdGetVersion(index);
    }
  }
  return -1;
};

export const logGenerateNextModifiedId = (id: string) => (log: Log) =>
  `${modifiedIdGetVirginId(id)}#${logGetLatestVersion(id)(log) + 1}`;

export const entryFindModifiedId = (indexOrId: string) => (entry: Entry) =>
  setFind(i => modifiedIdGetVirginId(i) === indexOrId, entry);

export const modifiedIdGetVirginId = (index: ModifiedId) =>
  modifiedIdParse(index)[0];

const modifiedIdParse = (index: ModifiedId) => index.split('#');

export const modifiedIdIncrement = (index: ModifiedId) =>
  `${modifiedIdGetVirginId(index)}#${modifiedIdGetVersion(index) + 1}`;
