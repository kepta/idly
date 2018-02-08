import * as R from 'ramda';
import { nodeFactory } from '../../osm/entityFactory/nodeFactory';
import { relationFactory } from '../../osm/entityFactory/relationFactory';
import { wayFactory } from '../../osm/entityFactory/wayFactory';
import { Entity } from '../../osm/structures';
import { setCreate } from '../helper';
import { addEntryToLog, Log, logCreate } from '../log';
import {
  OsmElement,
  OsmStateCreate,
  OsmStateAddModifieds,
  osmStateAddVirgins,
} from './elementTable';

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

const dummyElement = (
  entity: Entity,
  parentWays = setCreate<string>(),
  parentRelations = setCreate<string>()
): OsmElement => ({
  entity,
  parentRelations,
  parentWays,
});

describe('basic additions', () => {
  it('adds entities', () => {
    const state = OsmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '');

    expect(state.getElementTable()).toEqual(
      new Map([['n1', dummyElement(n1)], ['n2', dummyElement(n2)]])
    );
  });

  it('adds parentways', () => {
    const state = OsmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '');
    osmStateAddVirgins(state, [w1], '');
    expect(state.getElementTable()).toEqual(
      new Map([
        ['n1', dummyElement(n1, setCreate(['w1']))],
        ['n2', dummyElement(n2, setCreate(['w1']))],
        ['w1', dummyElement(w1)],
      ])
    );
  });

  it('adds everything correctly', () => {
    const state = OsmStateCreate();
    osmStateAddVirgins(state, [n1, n2, w2, w1, n3, r1, n4], '');
    expect(state.getElementTable()).toMatchSnapshot();
  });
});

describe('addVirgin', () => {
  it('should add', () => {
    const baseSetup = () => {
      const s = OsmStateCreate();
      osmStateAddVirgins(s, [n1, n2, w1], '123');
      return s;
    };

    const log1 = logCreate();
    const state1 = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const n2Hash0 = nodeFactory({
      id: 'n2#0',
    });

    osmStateAddVirgins(state1, [n3, n4], '121');

    expect(state1.getElementTable()).toMatchSnapshot();
    expect(state1.getQuadkeysTable()).toMatchSnapshot();

    const log2 = addEntryToLog(setCreate([n1Hash0, n2Hash0].map(r => r.id)))(
      log1
    );

    OsmStateAddModifieds(state1, log2, [n1Hash0, n2Hash0]);

    expect(state1.getElementTable()).toMatchSnapshot();
    expect(state1.getQuadkeysTable()).toMatchSnapshot();

    osmStateAddVirgins(state1, [w2, r1], '33');

    expect(state1.getElementTable()).toMatchSnapshot();
    expect(state1.getQuadkeysTable()).toMatchSnapshot();

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

    OsmStateAddModifieds(state1, log3, [n3Hash0, n1Hash1, r1Hash0]);

    expect([...state1.getElementTable().keys()]).toMatchSnapshot();
    expect(state1.getQuadkeysTable()).toMatchSnapshot();

    expect(state1.getVisible([''], log3)).toMatchSnapshot();

    expect(state1.getVisible(['33'], log3)).toMatchSnapshot();

    expect(state1.getVisible(['121'], log3)).toMatchSnapshot();

    const r1Hash1 = relationFactory({
      id: 'r1#1',
    });

    const log4 = addEntryToLog(setCreate([r1Hash1].map(r => r.id)))(log3);

    OsmStateAddModifieds(state1, log4, [r1Hash1]);

    expect([...state1.getElementTable().keys()]).toMatchSnapshot();

    expect(state1.getVisible(['33'], log4).has(r1Hash1.id)).toBe(true);
  });
});

describe('stateAddModifieds', () => {
  it('should stay same when empty log is passed', () => {
    const state = OsmStateCreate();
    osmStateAddVirgins(state, [n1, n2, w1], '123');

    expect(state).toEqual(
      R.tap(s => osmStateAddVirgins(s, [n1, n2, w1], '123'), OsmStateCreate())
    );
  });

  it('should do a simple stateAddModifieds', () => {
    const baseSetup = () => {
      const s = OsmStateCreate();
      osmStateAddVirgins(s, [n1, n2, w1], '123');
      osmStateAddVirgins(s, [n3], '12210');
      return s;
    };

    const state = baseSetup();

    const log1 = logCreate();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const log2: Log = addEntryToLog(setCreate([n1Hash0.id]))(log1);

    OsmStateAddModifieds(state, log2, [n1Hash0]);

    expect(state).toEqual(
      R.tap(s => osmStateAddVirgins(s, [n1Hash0], ''), baseSetup())
    );
  });

  it('should throw error when log and modified entities dont match', () => {
    const baseSetup = () => {
      const s = OsmStateCreate();
      osmStateAddVirgins(s, [n1, n2, w1], '123');
      return s;
    };

    const log1 = logCreate();
    const state = baseSetup();
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
      OsmStateAddModifieds(state, log2, [n1Hash0, n2Hash0])
    ).toThrowErrorMatchingSnapshot();

    const log3 = addEntryToLog(setCreate([n1Hash0.id, w1Hash0.id]))(log1);
    expect(() =>
      OsmStateAddModifieds(state, log3, [n1Hash0])
    ).toThrowErrorMatchingSnapshot();
  });
});
