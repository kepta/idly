import * as R from 'ramda';
import {
  nodeFactory,
  relationFactory,
  wayFactory,
} from '../../osm/entityFactory/index';
import { Entity } from '../../osm/structures';
import { setCreate } from '../helper';
import { addEntryToLog, Log, logCreate } from '../log/index';
import {
  Element,
  elementTableBulkAdd,
  elementTableCreate,
} from './elementTable';
import { quadkeysTableAdd, quadkeysTableCreate } from './quadkeysTable';
import { State } from './state';

const mapFromObj = <T>(o: any = {}): Map<string, T> =>
  Object.keys(o).reduce((prev, k) => {
    prev.set(k, o[k]);
    return prev;
  }, new Map());

const dummyElement = (
  entity: Entity,
  parentWays = setCreate<string>(),
  parentRelations = setCreate<string>()
): Element => ({
  entity,
  parentRelations,
  parentWays,
});

const dummyElementT = (e: Entity[]) =>
  R.tap(t => elementTableBulkAdd(t, e), elementTableCreate());

const dummyQuadkeyT = (obj: any): any => mapFromObj(obj);

const n1 = nodeFactory({
  id: 'n1',
});
const n2 = nodeFactory({
  id: 'n2',
});
const n3 = nodeFactory({
  id: 'n3',
});
const n4 = nodeFactory({
  id: 'n4',
});
const w1 = wayFactory({
  id: 'w1',
  nodes: ['n1', 'n2'],
});

const w2 = wayFactory({
  id: 'w2',
  nodes: ['n1', 'n3'],
});

const r1 = relationFactory({
  id: 'r1',
  members: [{ id: 'n4', ref: 'n4' }, { id: 'w2', ref: 'w2' }],
});

describe('constructing state and basic tests', () => {
  it('should create', () => {
    expect(State.create()).toEqual({
      _elementTable: mapFromObj(),
      _quadkeysTable: mapFromObj(),
      log: [],
    });
  });
  it('should create with given values', () => {
    const elementTable = elementTableCreate();
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');
    const opt = {
      elementTable,
      log: [setCreate([])],
      quadkeysTable,
    };
    expect(State.create(opt)).toMatchSnapshot();
  });
});

describe('fork', () => {
  it('should work with blank arrays', () => {
    const elementTable = elementTableCreate();
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');

    const log = logCreate();

    expect(
      State.create({
        elementTable,
        log,
        quadkeysTable,
      }).fork([], [])
    ).toEqual(
      State.create({
        elementTable,
        log,
        quadkeysTable,
      })
    );
  });

  it('should return same ref if same log is passed', () => {
    const elementTable = elementTableCreate();
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');

    const log = logCreate();
    const state = State.create({
      elementTable,
      log,
      quadkeysTable,
    });

    expect(state.fork(log, [])).toBe(state);
  });

  it('should do a simple fork', () => {
    const elementTable = dummyElementT([n1, n2, w1]);
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');
    quadkeysTableAdd(quadkeysTable, ['n3'], '12210');

    const log1 = logCreate();

    const state1 = State.create({
      elementTable,
      log: log1,
      quadkeysTable,
    });

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const log2: Log = addEntryToLog(setCreate([n1Hash0.id]))(log1);

    const state2 = state1.fork(log2, [n1Hash0]);

    expect(state2).toEqual(
      State.create({
        elementTable: dummyElementT([n1, n2, w1, n1Hash0]),
        log: log2,
        quadkeysTable: dummyQuadkeyT({
          '': setCreate(['n1#0']),
          '12210': setCreate(['n3']),
          '123': setCreate(['n1', 'n2', 'w1']),
        }),
      })
    );
  });

  it('should throw error when log and modified entities dont match', () => {
    const elementTable = elementTableCreate();
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');

    const log1 = logCreate();
    const state = State.create({
      elementTable,
      log: log1,
      quadkeysTable,
    });
    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const n2Hash0 = nodeFactory({
      id: 'n2#0',
    });

    const w1Hash0 = wayFactory({
      id: 'w1#0',
      nodes: [n1Hash0.id, n2Hash0.id],
    });

    const log2 = addEntryToLog(setCreate([n1Hash0.id, w1Hash0.id]))(log1);
    expect(() =>
      state.fork(log2, [n1Hash0, n2Hash0])
    ).toThrowErrorMatchingSnapshot();

    const log3 = addEntryToLog(setCreate([n1Hash0.id, w1Hash0.id]))(log1);
    expect(() => state.fork(log3, [n1Hash0])).toThrowErrorMatchingSnapshot();
  });
});

describe('getVisible', () => {
  it('should get ids', () => {
    const elementTable = dummyElementT([n1, n2, w1]);
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');

    const log1 = logCreate();

    const state1 = State.create({
      elementTable,
      log: log1,
      quadkeysTable,
    });
    state1.addVirgin([n3], '121');
    state1.addVirgin([n4], '130');

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const n2Hash0 = nodeFactory({
      id: 'n2#0',
    });
    const w1Hash0 = wayFactory({
      id: 'w1#0',
      nodes: [n1Hash0.id, n2Hash0.id],
    });

    const log2 = addEntryToLog(
      setCreate([n1Hash0, n2Hash0, w1Hash0].map(r => r.id))
    )(log1);

    const state2 = state1.fork(log2, [n1Hash0, n2Hash0, w1Hash0]);

    expect(state2.getVisible(['123'])).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0].map(e => e.id))
    );

    expect(state2.getVisible(['121'])).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0, n3].map(e => e.id))
    );

    expect(state2.getVisible(['130'])).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0, n4].map(e => e.id))
    );

    expect(state2.getVisible(['1'])).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0, n3, n4].map(e => e.id))
    );
  });
});

describe('addVirgin', () => {
  it('should add', () => {
    const elementTable = dummyElementT([n1, n2, w1]);
    const quadkeysTable = quadkeysTableCreate();
    elementTableBulkAdd(elementTable, [n1, n2, w1]);
    quadkeysTableAdd(quadkeysTable, ['n1', 'n2', 'w1'], '123');

    const log1 = logCreate();

    const state1 = State.create({
      elementTable,
      log: log1,
      quadkeysTable,
    });

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const n2Hash0 = nodeFactory({
      id: 'n2#0',
    });

    state1.addVirgin([n3, n4], '121');
    expect(state1.getElementTable()).toMatchSnapshot();
    expect(state1.getQuadkeysTable()).toMatchSnapshot();

    const log2 = addEntryToLog(setCreate([n1Hash0, n2Hash0].map(r => r.id)))(
      log1
    );

    const state2 = state1.fork(log2, [n1Hash0, n2Hash0]);
    expect(state2.getElementTable()).toMatchSnapshot();
    expect(state2.getQuadkeysTable()).toMatchSnapshot();

    state2.addVirgin([w2, r1], '33');
    expect(state2.getElementTable()).toMatchSnapshot();
    expect(state2.getQuadkeysTable()).toMatchSnapshot();

    const n3Hash0 = nodeFactory({
      id: 'n3#0',
    });

    const n1Hash1 = nodeFactory({
      id: 'n1#1',
    });

    const r1Hash0 = relationFactory({
      id: 'r1#0',
    });

    const log3 = addEntryToLog(
      setCreate([n3Hash0, n1Hash1, r1Hash0].map(r => r.id))
    )(log2);

    const state3 = state2.fork(log3, [n3Hash0, n1Hash1, r1Hash0]);

    expect([...state3.getElementTable().keys()]).toMatchSnapshot();
    expect(state3.getQuadkeysTable()).toMatchSnapshot();

    expect(state3.getVisible([''])).toMatchSnapshot();

    expect(state3.getVisible(['33'])).toMatchSnapshot();

    expect(state3.getVisible(['121'])).toMatchSnapshot();

    const r1Hash1 = relationFactory({
      id: 'r1#1',
    });

    const log4 = addEntryToLog(setCreate([r1Hash1].map(r => r.id)))(log3);
    const state4 = state3.fork(log4, [r1Hash1]);

    expect([...state4.getElementTable().keys()]).toMatchSnapshot();
    expect(state4.getVisible(['33']).has(r1Hash1.id)).toBe(true);
  });
});
