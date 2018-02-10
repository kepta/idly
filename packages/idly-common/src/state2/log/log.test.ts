import { setCreate } from '../helper';
import {
  doesLogContain,
  doesLogHaveNewerOrCurrentVersion,
  Log,
  logAddEntry,
  logGetLatestModifiedIds,
  logGetLatestVersion,
  logGetVirginIdsOfModifiedIds,
  logRecreate,
} from './index';

const createAndAdd = (ids: string[]) => (log: Log) =>
  logAddEntry(setCreate(ids))(log);

describe('doesLogContain', () => {
  test('basic', () => {
    expect(doesLogContain(setCreate(['1', '2']))([setCreate(['0'])])).toBe(
      false
    );
    expect(doesLogContain(setCreate(['1', '2']))([setCreate(['2'])])).toBe(
      true
    );
  });

  test('advanced', () => {
    const log = logRecreate(setCreate(['2#0']), setCreate(['3#0']));
    const t1 = doesLogContain(setCreate(['2#0']))(log);
    expect(t1).toBe(true);

    const t2 = doesLogContain(setCreate(['3#0']))(log);
    expect(t2).toBe(true);

    const t3 = doesLogContain(setCreate(['3#1']))(log);
    expect(t3).toBe(false);
  });
});

describe('logRecreate', () => {
  test('should throw error when out of order', () => {
    expect(() =>
      logRecreate(setCreate(['2#0']), setCreate(['2#1']))
    ).toThrowError();
  });
});

describe('doesLogHasNewerOrExistingVersion', () => {
  test('log doesnt have new version', () => {
    const log = logRecreate(setCreate(['2#0']), setCreate(['3#0']));

    expect(doesLogHaveNewerOrCurrentVersion('2#1')(log)).toBe(false);
    expect(doesLogHaveNewerOrCurrentVersion('3#1')(log)).toBe(false);
  });

  test('log has the same version', () => {
    const log = logRecreate(setCreate(['2#0']), setCreate(['3#0']));

    expect(doesLogHaveNewerOrCurrentVersion('2#0')(log)).toBe(true);
    expect(doesLogHaveNewerOrCurrentVersion('3#0')(log)).toBe(true);
  });

  test('log doesnt have the id', () => {
    const log = logRecreate(
      setCreate(['2#1', '5#0']),
      setCreate(['4#0']),
      setCreate(['3#1']),
      setCreate(['2#0']),
      setCreate(['3#0'])
    );
    expect(doesLogHaveNewerOrCurrentVersion('8#0')(log)).toBe(false);
    expect(doesLogHaveNewerOrCurrentVersion('7#2')(log)).toBe(false);
  });
  test('log has a newer version', () => {
    const log = logRecreate(
      setCreate(['2#1', '5#0']),
      setCreate(['4#0']),
      setCreate(['3#1']),
      setCreate(['2#0']),
      setCreate(['3#0'])
    );
    expect(doesLogHaveNewerOrCurrentVersion('2#0')(log)).toBe(true);
    expect(doesLogHaveNewerOrCurrentVersion('3#0')(log)).toBe(true);
  });
});

describe('addEntryToLog', () => {
  test('add  empty', () => {
    expect(logAddEntry(setCreate())([])).toEqual([setCreate()]);
    expect(logAddEntry(setCreate(['3#1']))([])).toEqual([setCreate(['3#1'])]);
  });
  test("doesn't add already existing", () => {
    const log = logRecreate(setCreate(['2#0']), setCreate(['3#0']));
    const log2 = createAndAdd(['3#0', '3#1'])(log);
    expect(log2).toBe(log);

    const log3 = createAndAdd(['3#1', '3#0'])(log);
    expect(log3).toBe(log);
  });

  test('adds non existing ids', () => {
    const log = logRecreate(setCreate(['2#0']), setCreate(['3#0']));
    const log2 = createAndAdd(['3#1'])(log);

    expect(log2).toEqual([setCreate(['3#1']), ...log]);

    const log3 = createAndAdd(['3#3', '4#4'])(log);
    expect(log3).toEqual([setCreate(['3#3', '4#4']), ...log]);

    const log4 = createAndAdd(['5#5'])(log3);
    expect(log4).toEqual([
      setCreate(['5#5']),
      setCreate(['3#3', '4#4']),
      ...log,
    ]);
  });
});

describe('getLatestVersion', () => {
  test('basic', () => {
    const log = logRecreate(
      setCreate(['2#4']),
      setCreate(['3#2', '2#3']),
      setCreate(['3#0', '2#2']),
      setCreate(['2#1']),
      setCreate(['4#0'])
    );
    expect(logGetLatestVersion('4#0')(log)).toEqual(0);
    expect(logGetLatestVersion('2')(log)).toEqual(4);
    expect(logGetLatestVersion('3')(log)).toEqual(2);
  });

  test('get version of index that doesnt exist', () => {
    const log = logRecreate(
      setCreate(['2#2']),
      setCreate(['3#2', '2#1']),
      setCreate(['2#0'])
    );
    expect(logGetLatestVersion('4#1')(log)).toEqual(-1);
  });

  test('get version of index that doesnt exist', () => {
    const log = logRecreate(
      setCreate(['2#2']),
      setCreate(['3#2', '2#1']),
      setCreate(['2#0', '3#0'])
    );
    expect(logGetLatestVersion('2#1')(log)).toEqual(2);
  });

  test('get version of index which has a newer version in log', () => {
    const log = logRecreate(
      setCreate(['2#2']),
      setCreate(['3#2', '2#1']),
      setCreate(['2#0'])
    );
    expect(logGetLatestVersion('2#1')(log)).toEqual(2);
    expect(logGetLatestVersion('2#0')(log)).toEqual(2);
  });

  test('get version when version doesnt exist', () => {
    const log = logRecreate(
      setCreate(['4#4']),
      setCreate(['2#4']),
      setCreate(['3#1', '2#3']),
      setCreate(['3#0', '2#0'])
    );
    expect(logGetLatestVersion('3')(log)).toEqual(1);
    expect(logGetLatestVersion('2')(log)).toEqual(4);
  });
});

describe('getAllIds', () => {
  const log = logRecreate(
    setCreate(['2#4']),
    setCreate(['3#2', '2#3']),
    setCreate(['3#0', '2#2']),
    setCreate(['2#1']),
    setCreate(['4#0', '5#0'])
  );
  test('basic', () => {
    expect(logGetVirginIdsOfModifiedIds(log)).toEqual(
      new Set(['2', '3', '5', '4'])
    );
  });
  test('weak caches', () => {
    expect(logGetVirginIdsOfModifiedIds(log)).toBe(
      logGetVirginIdsOfModifiedIds(log)
    );
  });
});

describe('getAllLatestIndexes', () => {
  const log = logRecreate(
    setCreate(['2#4']),
    setCreate(['3#2', '2#3']),
    setCreate(['3#0', '2#2']),
    setCreate(['2#1']),
    setCreate(['4#0', '5#0'])
  );
  test('basic', () => {
    expect(logGetLatestModifiedIds(log)).toEqual(
      setCreate(['2#4', '3#2', '5#0', '4#0'])
    );
  });
  test('weak caches', () => {
    expect(logGetVirginIdsOfModifiedIds(log)).toBe(
      logGetVirginIdsOfModifiedIds(log)
    );
  });
});
