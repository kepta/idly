import * as R from 'ramda';

import { nodeFactory } from 'idly-common/lib/osm/entityFactory/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/entityFactory/relationFactory';
import { wayFactory } from 'idly-common/lib/osm/entityFactory/wayFactory';
import { Entity } from 'idly-common/lib/osm/structures';
import { setCreate } from '../helper';
import {
  stateAddChanged,
  stateAddVirgins,
  stateCreate,
  stateGenNextId,
  stateGetEntity,
  stateGetVisibles,
  stateShred,
} from '../index';

import { virginStateCreate } from '../state/state';
import { expectStable } from '../tests/expectStable';
import { OsmState } from '../type';
const mapFromObj = (o: any): Map<string, any> =>
  Object.keys(o).reduce((prev, k) => {
    prev.set(k + '', o[k]);
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

const n6 = nodeFactory({
  id: 'n6',
});

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

// const r3 = relationFactory({
//   id: 'r3',
//   members: [
//     { id: 'r1', ref: 'r1' },
//     { id: 'w2', ref: 'w2' },
//     { id: 'n1', ref: 'n1' },
//   ],
// });

const dummyElement = (
  entity: Entity,
  parentWays = setCreate<string>(),
  parentRelations = setCreate<string>()
) => ({
  entity,
  parentRelations,
  parentWays,
});

describe('Adds virgin entities', () => {
  it('should handle empty quadkey', () => {
    const state = stateCreate();
    stateAddVirgins(state, [n1, n2], '');

    expectStable(state.virgin.elements).toEqual(
      new Map([['n1', n1], ['n2', n2]])
    );
  });

  it('should handle sibbling quadkeys, 1', () => {
    const state = stateCreate();
    stateAddVirgins(state, [n1, n2], '13');
    stateAddVirgins(state, [w1], '12');

    expectStable(stateGetVisibles(state, ['12', '13'])).toEqual(
      new Map([
        ['n1', dummyElement(n1, setCreate(['w1']))],
        ['n2', dummyElement(n2, setCreate(['w1']))],
        ['w1', dummyElement(w1)],
      ])
    );
  });

  it('should handle sibbling quadkeys, 2', () => {
    const state = stateCreate();
    stateAddVirgins(state, [n1, n2, r1, n4], '123');
    stateAddVirgins(state, [n3, w2, n1, w1, n4], '121');

    expectStable(stateGetVisibles(state, ['123', '121'])).toMatchSnapshot();
  });
});

describe('Get the visible entities', () => {
  describe('series of modified entities addition', () => {
    let state = stateCreate();

    it('should add virgins at different quadkeys', () => {
      stateAddVirgins(state, [n1, n2, w1], '123');

      stateAddVirgins(state, [n3, n4], '121');

      expectStable(state.log).toMatchSnapshot();
      expectStable(state.changedTable).toMatchSnapshot();
      expectStable(state.virgin).toMatchSnapshot();
      expectStable(state.derivedTable).toMatchSnapshot();
    });

    it('should add modifieds', () => {
      const n1Hash0 = nodeFactory({
        id: 'n1#0',
      });

      const n2Hash0 = nodeFactory({
        id: 'n2#0',
      });

      state = stateAddChanged(state, [n1Hash0, n2Hash0]);
      stateAddVirgins(state, [w2, r1], '33');

      expectStable(state.log).toMatchSnapshot();
      expectStable(state.changedTable).toMatchSnapshot();
      expectStable(state.virgin).toMatchSnapshot();
      expectStable(state.derivedTable).toMatchSnapshot();
    });

    it('should add related entities, base entities & related entities of base entities', () => {
      const n3Hash0 = nodeFactory({
        id: 'n3#0',
      });
      const n1Hash1 = nodeFactory({
        id: 'n1#1',
      });
      const r1Hash0 = relationFactory({
        id: 'r1#0',
      });

      expect(state.changedTable.has('w2')).toBe(false);

      state = stateAddChanged(state, [n3Hash0, n1Hash1, r1Hash0]);
      // related entity of base entity r1
      expect(state.changedTable.has('w2')).toBe(true);

      const nn1: any = stateGetVisibles(state, ['33']).get('n1');
      expectStable(nn1.parentWays).toEqual(setCreate(['w2']));
      expectStable(nn1.parentRelations).toEqual(setCreate());

      const nn3: any = stateGetVisibles(state, ['33']).get('n3');
      expectStable(nn3.parentWays).toEqual(setCreate(['w2']));
      expectStable(nn3.parentRelations).toEqual(setCreate());
    });

    it('should get correct visibles of different quadkeys', () => {
      expectStable(stateGetVisibles(state, []).keys()).toMatchSnapshot();
      expectStable(stateGetVisibles(state, ['33'])).toMatchSnapshot();
      expectStable(stateGetVisibles(state, ['121'])).toMatchSnapshot();
    });

    it('should add a modified relation', () => {
      const r1Hash1 = relationFactory({
        id: 'r1#1',
      });
      const state4 = stateAddChanged(state, [r1Hash1]);
      expectStable(stateGetVisibles(state4, ['33']).has(r1Hash1.id)).toBe(true);
      expectStable(stateGetVisibles(state4, ['33']).has(r1.id)).toBe(false);

      expectStable(state4.log).toMatchSnapshot();
      expectStable(state4.changedTable).toMatchSnapshot();
      expectStable(state4.virgin).toMatchSnapshot();
      expectStable(state4.derivedTable).toMatchSnapshot();
    });
  });

  it('if different entities with same ids exist in changed and virgin, changed should take precedence', () => {
    const n1InVirgin = nodeFactory({ id: 'n1' });
    const n1InChanged = nodeFactory({ id: 'n1', tags: { k: 'k' } });
    const state: OsmState = {
      changedTable: mapFromObj({
        n1: n1InChanged,
      }),
      derivedTable: new Map(),
      log: [],
      virgin: virginStateCreate(
        mapFromObj({
          n1: n1InVirgin,
        }),
        mapFromObj({
          33: setCreate(['n1']),
        })
      ),
    };
    expectStable(
      (stateGetVisibles(state, ['33']).get('n1') as any).entity
    ).toBe(n1InChanged);
  });
});

describe('stateAddModifieds', () => {
  it('should stay same when empty log is passed', () => {
    const state = stateCreate();
    stateAddVirgins(state, [n1, n2, w1], '123');

    expectStable(state).toEqual(
      R.tap(s => stateAddVirgins(s, [n1, n2, w1], '123'), stateCreate())
    );
  });

  it('should do a simple stateAddModifieds', () => {
    const baseSetup = () => {
      const s = stateCreate();
      stateAddVirgins(s, [n1, n2, w1], '123');
      stateAddVirgins(s, [n3], '12210');
      return s;
    };

    const state = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const state2 = stateAddChanged(state, [n1Hash0]);

    expectStable(state2).toEqual(stateAddChanged(baseSetup(), [n1Hash0]));
  });

  it('saves the base version in changedTable of modified ids', () => {
    const baseSetup = () => {
      const s = stateCreate();
      stateAddVirgins(s, [n1, n2, w1], '123');
      stateAddVirgins(s, [n3], '12210');
      return s;
    };

    const state = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const state2 = stateAddChanged(state, [n1Hash0]);

    expectStable(state2.changedTable.get('n1')).toEqual(n1);
    expectStable(state2.changedTable.has('n2')).toEqual(false);
    expectStable(state2.changedTable.has('w1')).toEqual(false);
  });

  it('saves the base versions related entities ', () => {
    const baseSetup = () => {
      const s = stateCreate();
      stateAddVirgins(s, [n1, n2, w1], '123');
      stateAddVirgins(s, [r2], '12210');
      stateAddVirgins(s, [w3, n6], '12210');
      return s;
    };
    let state = baseSetup();

    const r2hash0 = nodeFactory({
      id: 'r2#0',
    });
    expect(state.changedTable.has('r2')).toBe(false);
    expect(state.changedTable.has('r2')).toBe(false);
    expect(state.changedTable.has('n6')).toBe(false);

    state = stateAddChanged(state, [r2hash0]);
    expect(state.changedTable.has('r2#0')).toBe(true);
    expect(state.changedTable.has('r2')).toBe(true);
    expect(state.changedTable.has('r2')).toBe(true);
    expect(state.changedTable.has('n6')).toBe(true);
  });

  it('handles when relation points to entity which does not yet exist');
});

describe('osmStateGetNextId', () => {
  const baseSetup = () => {
    const s = stateCreate();
    stateAddVirgins(s, [n1, n2, w1], '123');
    return s;
  };

  it('should generate id', () => {
    let state = baseSetup();
    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    state = stateAddChanged(state, [n1Hash0]);

    expectStable(stateGenNextId(state, n1Hash0.id)).toBe('n1#1');

    const n1Hash1 = nodeFactory({
      id: 'n1#1',
    });

    state = stateAddChanged(state, [n1Hash1]);
    expectStable(stateGenNextId(state, n1Hash1.id)).toBe('n1#2');
  });

  it('different branches should get the same version ids in the element table', () => {
    const baseState = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const state = stateAddChanged(baseState, [n1Hash0]);

    expectStable(stateGenNextId(baseState, n1.id)).toBe('n1#0');

    expectStable(stateGenNextId(state, n1.id)).toBe('n1#1');
  });

  it('handles version newer the current', () => {
    const baseState = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const state1 = stateAddChanged(baseState, [n1Hash0]);
    expectStable(stateGenNextId(state1, 'n1')).toBe('n1#1');
    expectStable(stateGenNextId(state1, 'n1#1')).toBe('n1#1');
    expectStable(stateGenNextId(state1, 'n1#100')).toBe('n1#1');
    expectStable(stateGenNextId(state1, 'n1#-1')).toBe('n1#1');
    expectStable(stateGenNextId(state1, 'n1#2')).toBe('n1#1');
  });

  it('handles branched states', () => {
    const baseState = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const state1 = stateAddChanged(baseState, [n1Hash0]);

    const n2Hash0 = nodeFactory({
      id: 'n2#0',
    });

    const n1Hash1 = {
      ...n1Hash0,
      id: stateGenNextId(state1, n1Hash0.id),
    };

    const state2 = stateAddChanged(state1, [n1Hash1, n2Hash0]);

    expectStable(stateGenNextId(baseState, 'n1')).toBe('n1#0');
    expectStable(stateGenNextId(state1, 'n1')).toBe('n1#1');
    expectStable(stateGenNextId(state2, 'n1#1')).toBe('n1#2');
    expectStable(stateGenNextId(state2, 'n2')).toBe('n2#1');
    expectStable(stateGenNextId(baseState, 'n2')).toBe('n2#0');
  });

  it('fills in missing versions in between element table', () => {
    const state = stateCreate();

    const n1Hash3 = nodeFactory({
      id: 'n1#3',
    });

    const n1Hash5 = nodeFactory({
      id: 'n1#5',
    });

    stateAddVirgins(state, [n1, n2, w1], '123');

    const branchedState1 = stateAddChanged(state, [n1Hash5]);

    expectStable(stateGenNextId(branchedState1, 'n1#0')).toBe('n1#6');

    const branchedState2 = stateAddChanged(state, [n1Hash3]);

    expectStable(stateGenNextId(branchedState2, 'n1#0')).toBe('n1#4');

    expectStable(stateGenNextId(state, 'n1#0')).toBe('n1#0');

    let branchedState3 = stateAddChanged(state, [
      nodeFactory({ id: stateGenNextId(state, 'n1#0') }),
    ]);

    expectStable(stateGenNextId(branchedState3, 'n1#0')).toBe('n1#1');

    branchedState3 = stateAddChanged(branchedState3, [
      nodeFactory({ id: stateGenNextId(branchedState3, 'n1#0') }),
    ]);

    expectStable(stateGenNextId(branchedState3, 'n1')).toBe('n1#2');

    branchedState3 = stateAddChanged(branchedState3, [
      nodeFactory({ id: stateGenNextId(branchedState3, 'n1#0') }),
    ]);

    expectStable(stateGenNextId(branchedState3, 'n1')).toBe('n1#3');

    branchedState3 = stateAddChanged(branchedState3, [
      nodeFactory({ id: stateGenNextId(branchedState3, 'n1#0') }),
    ]);

    expectStable(stateGenNextId(branchedState3, 'n1#0')).toBe('n1#4');
  });
});

describe('osmStateShred', () => {
  it('should loose virgin non base ids', () => {
    let state = stateCreate();
    stateAddVirgins(state, [n1, n2, w1], '123');
    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    state = stateAddChanged(state, [n1Hash0]);

    state = stateShred(state);

    expectStable(state.changedTable).toEqual(
      mapFromObj({
        n1,
        'n1#0': n1Hash0,
      })
    );

    expectStable(stateGetVisibles(state, ['123']).size).toBe(1);
    expectStable(stateGetVisibles(state, ['123'])).toMatchSnapshot();
  });

  it('should not delete nodes of modified ways', () => {
    let state = stateCreate();
    stateAddVirgins(state, [n1, n2, n3, w1, n4], '123');
    const w1Hash0 = wayFactory({
      id: 'w1#0',
      nodes: ['n1', 'n3'],
    });

    expectStable(stateGetEntity(state, 'n4')).toBe(n4);
    state = stateAddChanged(state, [w1Hash0]);
    state = stateShred(state);
    expectStable(stateGetEntity(state, 'n1')).toBe(n1);
    expectStable(stateGetEntity(state, 'n2')).toBe(n2);
    expectStable(stateGetEntity(state, 'n3')).toBe(n3);
    expectStable(stateGetEntity(state, 'n4')).toBe(undefined);

    expectStable(stateGetVisibles(state, ['123'])).toMatchSnapshot();
  });

  it('should not delete nodes of nonlatest modified ways', () => {
    let state = stateCreate();
    stateAddVirgins(state, [n1, n2, n3, w1, n4], '123');

    const w1Hash0 = wayFactory({
      id: 'w1#0',
      nodes: ['n3', 'n4'],
    });

    state = stateAddChanged(state, [w1Hash0]);

    state = stateShred(state);
    expectStable(stateGetEntity(state, 'n1')).toBe(n1);
    expectStable(stateGetEntity(state, 'n2')).toBe(n2);
    expectStable(stateGetEntity(state, 'n3')).toBe(n3);
    expectStable(stateGetEntity(state, 'n4')).toBe(n4);
    expectStable(stateGetEntity(state, 'w1')).toBe(w1);
    expectStable(stateGetEntity(state, 'w1#0')).toBe(w1Hash0);

    expectStable(stateGetVisibles(state, ['123'])).toMatchSnapshot();

    const w1Hash1 = wayFactory({
      id: 'w1#1',
      nodes: ['n1'],
    });

    state = stateAddChanged(state, [w1Hash1]);
    state = stateShred(state);
    expectStable(stateGetEntity(state, 'n1')).toBe(n1);
    expectStable(stateGetEntity(state, 'n2')).toBe(n2);
    expectStable(stateGetEntity(state, 'n3')).toBe(n3);
    expectStable(stateGetEntity(state, 'n4')).toBe(n4);
    expectStable(stateGetEntity(state, 'w1')).toBe(w1);
    expectStable(stateGetEntity(state, 'w1#0')).toBe(w1Hash0);
    expectStable(stateGetEntity(state, 'w1#1')).toBe(w1Hash1);

    expectStable(stateGetVisibles(state, ['123'])).toMatchSnapshot();
  });
});
