import { weakCache } from '../../misc/weakCache';
import { setCreate, setFind, setIntersect, setSome } from '../helper';
/**
 * The log is used as [...modifiedEntries, virginOsmEntries]
 * the pointer to virginOsmEntries resolves to EntityTable
 * we carefully mutate virginOsmEntries keeping the pointer same.
 *
 * modified entities are id#version where version [0, infinity) (0 is inclusive)
 */

export type Index = string;

export type Log = ReadonlyArray<Entry>;

export type Entry = ReadonlySet<string>;

export const validId = (str: string) => str.indexOf('#') === 0;

export const validIndex = (str: string) => !validId(str);

export const logGetModifiedIds = weakCache((log: Log) =>
  log.reduce((prev: Set<string>, cur) => {
    cur.forEach(index => prev.add(getId(index)));
    return prev;
  }, setCreate())
);

export const logGetLatestIndexes = weakCache(
  (log: Log) =>
    new Set(
      log
        .reduce((prev, cur) => {
          cur.forEach(
            index => !prev.has(getId(index)) && prev.set(getId(index), index)
          );
          return prev;
        }, new Map<string, string>())
        .values()
    )
);

export const logRecreate = (...entries: Entry[]) =>
  entries
    .slice(0)
    .reverse()
    .reduce((l, e) => {
      const newLog = addEntryToLog(e)(l);
      if (l === newLog) {
        throw new Error('malformed entries');
      }
      return newLog;
    }, logCreate());

export const logCreate = (): Log => Object.freeze([]);

export const doesLogContain = (entry: Entry) => (log: Log) =>
  log.some(e => setIntersect(entry, e).size > 0);

export const addEntryToLog = (entry: Entry) => (log: Log) =>
  setSome(index => doesLogHaveNewerOrCurrentVersion(index)(log), entry)
    ? log
    : Object.freeze([entry, ...log]);

export const doesLogHaveNewerOrCurrentVersion = (index: string) => (log: Log) =>
  getLatestVersion(index)(log) >= getVersion(index);

export const getVersion = (index: Index) => parseInt(parseIndex(index)[1], 10);

export const getLatestVersion = (id: string) => (log: Log) => {
  const finder = findInEntry(getId(id));
  let index;
  for (const entry of log) {
    index = finder(entry);
    if (index) {
      return getVersion(index);
    }
  }
  return -1;
};

export const genIndex = (id: string) => (log: Log) =>
  `${getId(id)}#${getLatestVersion(id)(log) + 1}`;

export const findInEntry = (indexOrId: string) => (entry: Entry) =>
  setFind(i => getId(i) === indexOrId, entry);

export const getId = (index: Index) => parseIndex(index)[0];

const parseIndex = (index: Index) => index.split('#');

export const incrVersion = (index: Index) =>
  `${getId(index)}#${getVersion(index) + 1}`;
