import * as R from 'ramda';
import { nodeFactory } from '../../osm/entityFactory/nodeFactory';
import { relationFactory } from '../../osm/entityFactory/relationFactory';
import { wayFactory } from '../../osm/entityFactory/wayFactory';
import { Entity } from '../../osm/structures';
import { setCreate } from '../helper';
import { Log, logAddEntry, logCreate } from '../log';
import { tableGet } from '../table';
import {
  OsmElement,
  osmStateAddModifieds,
  osmStateAddVirgins,
  osmStateCreate,
  osmStateGetVisible,
  osmStateShred,
  OsmTable,
  osmTableApplyParentRelations,
  osmTableApplyParentWays,
  parentRelationsTableCreate,
  parentWaysTableCreate,
} from './osmTable';

// tslint:disable:max-line-length
const mapFromObj = (o: any): Map<string, any> =>
  Object.keys(o).reduce((prev, k) => {
    prev.set(k, o[k]);
    return prev;
  }, new Map());

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
const n5 = nodeFactory({
  id: 'n5',
});

// const n6 = nodeFactory({
//   id: 'n6',
// });

// const n7 = nodeFactory({
//   id: 'n7',
// });

const w1 = wayFactory({
  id: 'w1',
  nodes: ['n1', 'n2'],
});

const w2 = wayFactory({
  id: 'w2',
  nodes: ['n1', 'n3'],
});

const w3 = wayFactory({
  id: 'w3',
  nodes: ['n3', 'n4', 'n5'],
});

const r1 = relationFactory({
  id: 'r1',
  members: [{ id: 'n4', ref: 'n4' }, { id: 'w2', ref: 'w2' }],
});

const r2 = relationFactory({
  id: 'r2',
  members: [
    { id: 'w1', ref: 'w1' },
    { id: 'w3', ref: 'w3' },
    { id: 'n6', ref: 'n6' },
  ],
});

const r3 = relationFactory({
  id: 'r3',
  members: [
    { id: 'r1', ref: 'r1' },
    { id: 'w2', ref: 'w2' },
    { id: 'n1', ref: 'n1' },
  ],
});

const dummyElement = (
  entity: Entity,
  parentWays = setCreate<string>(),
  parentRelations = setCreate<string>()
) => ({
  entity,
  parentRelations,
  parentWays,
});

describe('basic additions', () => {
  it('adds entities', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '');

    expect(state.getElementTable()).toEqual(new Map([['n1', n1], ['n2', n2]]));
  });

  it('adds parentways', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '13');
    osmStateAddVirgins(state, [w1], '12');
    expect(osmStateGetVisible(state, ['1'], [])).toEqual(
      new Map([
        ['n1', dummyElement(n1, setCreate(['w1']))],
        ['n2', dummyElement(n2, setCreate(['w1']))],
        ['w1', dummyElement(w1)],
      ])
    );
  });

  it('adds everything correctly', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, r1, n4], '123');
    osmStateAddVirgins(state, [n3, w2, n1, w1, n4], '121');

    expect(osmStateGetVisible(state, ['1'], [])).toMatchSnapshot();
  });
});

describe('osmStateGetVisible', () => {
  describe('series of operations', () => {
    const baseSetup = () => {
      const s = osmStateCreate();
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

    const log2 = logAddEntry(setCreate([n1Hash0, n2Hash0].map(r => r.id)))(
      log1
    );

    osmStateAddModifieds(state1, log2, [n1Hash0, n2Hash0]);

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

    const log3 = logAddEntry(
      setCreate([n3Hash0, n1Hash1, r1Hash0].map(r => r.id))
    )(log2);

    osmStateAddModifieds(state1, log3, [n3Hash0, n1Hash1, r1Hash0]);

    expect(state1.getElementTable()).toMatchSnapshot();
    expect(state1.getQuadkeysTable()).toMatchSnapshot();

    it('should add related entities not in the quadkey', () => {
      expect(
        (osmStateGetVisible(state1, ['33'], log3) as any).get('n1').parentWays
      ).toEqual(setCreate(['w2']));
      expect(osmStateGetVisible(state1, ['33'], log3).get('n3')).toEqual(
        dummyElement(n3, setCreate(['w2']))
      );
    });

    expect(osmStateGetVisible(state1, [''], log3).keys()).toMatchSnapshot();
    expect(osmStateGetVisible(state1, ['33'], log3)).toMatchSnapshot();
    expect(osmStateGetVisible(state1, ['121'], log3)).toMatchSnapshot();

    const r1Hash1 = relationFactory({
      id: 'r1#1',
    });

    const log4 = logAddEntry(setCreate([r1Hash1].map(r => r.id)))(log3);

    osmStateAddModifieds(state1, log4, [r1Hash1]);

    expect([...state1.getElementTable().keys()]).toMatchSnapshot();

    expect(osmStateGetVisible(state1, ['33'], log4).has(r1Hash1.id)).toBe(true);
  });
});

describe('stateAddModifieds', () => {
  it('should stay same when empty log is passed', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, w1], '123');

    expect(state).toEqual(
      R.tap(s => osmStateAddVirgins(s, [n1, n2, w1], '123'), osmStateCreate())
    );
  });

  it('should do a simple stateAddModifieds', () => {
    const baseSetup = () => {
      const s = osmStateCreate();
      osmStateAddVirgins(s, [n1, n2, w1], '123');
      osmStateAddVirgins(s, [n3], '12210');
      return s;
    };

    const state = baseSetup();

    const log1 = logCreate();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const log2: Log = logAddEntry(setCreate([n1Hash0.id]))(log1);

    osmStateAddModifieds(state, log2, [n1Hash0]);

    expect(state).toEqual(
      R.tap(s => osmStateAddVirgins(s, [n1Hash0], ''), baseSetup())
    );
  });

  it('should throw error when log and modified entities dont match', () => {
    const baseSetup = () => {
      const s = osmStateCreate();
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

    const log2 = logAddEntry(setCreate([n1Hash0.id, w1Hash0.id]))(log1);
    expect(() =>
      osmStateAddModifieds(state, log2, [n1Hash0, n2Hash0])
    ).toThrowErrorMatchingSnapshot();

    const log3 = logAddEntry(setCreate([n1Hash0.id, w1Hash0.id]))(log1);
    expect(() =>
      osmStateAddModifieds(state, log3, [n1Hash0])
    ).toThrowErrorMatchingSnapshot();
  });
});
