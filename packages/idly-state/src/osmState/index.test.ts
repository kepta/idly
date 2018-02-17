import { nodeFactory } from 'idly-common/lib/osm/entityFactory/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/entityFactory/relationFactory';
import { wayFactory } from 'idly-common/lib/osm/entityFactory/wayFactory';
import { Entity } from 'idly-common/lib/osm/structures';
import * as R from 'ramda';

import { setCreate } from '../helper';
import {
  osmStateAddModifieds,
  osmStateAddVirgins,
  osmStateCreate,
  osmStateGetEntity,
  osmStateGetNextId,
  osmStateGetVisible,
  osmStateShred,
} from './index';
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
// const n5 = nodeFactory({
//   id: 'n5',
// });

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

// const w3 = wayFactory({
//   id: 'w3',
//   nodes: ['n3', 'n4', 'n5'],
// });

const r1 = relationFactory({
  id: 'r1',
  members: [{ id: 'n4', ref: 'n4' }, { id: 'w2', ref: 'w2' }],
});

// const r2 = relationFactory({
//   id: 'r2',
//   members: [
//     { id: 'w1', ref: 'w1' },
//     { id: 'w3', ref: 'w3' },
//     { id: 'n6', ref: 'n6' },
//   ],
// });

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
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '');

    expect(state[0].getElementTable()).toEqual(
      new Map([['n1', n1], ['n2', n2]])
    );
  });

  it('should handle sibbling quadkeys, 1', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '13');
    osmStateAddVirgins(state, [w1], '12');

    expect(osmStateGetVisible(state, ['1'])).toEqual(
      new Map([
        ['n1', dummyElement(n1, setCreate(['w1']))],
        ['n2', dummyElement(n2, setCreate(['w1']))],
        ['w1', dummyElement(w1)],
      ])
    );
  });

  it('should handle sibbling quadkeys, 2', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, r1, n4], '123');
    osmStateAddVirgins(state, [n3, w2, n1, w1, n4], '121');

    expect(osmStateGetVisible(state, ['1'])).toMatchSnapshot();
  });
});

describe('Get the visible entities', () => {
  describe('series of modified entities addition', () => {
    let state = osmStateCreate();

    it('should add virgins at different quadkeys', () => {
      osmStateAddVirgins(state, [n1, n2, w1], '123');

      osmStateAddVirgins(state, [n3, n4], '121');

      expect(state).toMatchSnapshot();
    });

    it('should add modifieds', () => {
      const n1Hash0 = nodeFactory({
        id: 'n1#0',
      });

      const n2Hash0 = nodeFactory({
        id: 'n2#0',
      });
      state = osmStateAddModifieds(state, [n1Hash0, n2Hash0]);

      osmStateAddVirgins(state, [w2, r1], '33');

      expect(state).toMatchSnapshot();
    });

    it('should add related entities not in the quadkey', () => {
      const n3Hash0 = nodeFactory({
        id: 'n3#0',
      });
      const n1Hash1 = nodeFactory({
        id: 'n1#1',
      });
      const r1Hash0 = relationFactory({
        id: 'r1#0',
      });

      state = osmStateAddModifieds(state, [n3Hash0, n1Hash1, r1Hash0]);

      const nn1: any = osmStateGetVisible(state, ['33']).get('n1');
      expect(nn1.parentWays).toEqual(setCreate(['w2']));
      expect(nn1.parentRelations).toEqual(setCreate());

      const nn3: any = osmStateGetVisible(state, ['33']).get('n3');
      expect(nn3.parentWays).toEqual(setCreate(['w2']));
      expect(nn3.parentRelations).toEqual(setCreate());
    });

    it('should get correct visibles of different quadkeys', () => {
      expect(osmStateGetVisible(state, ['']).keys()).toMatchSnapshot();
      expect(osmStateGetVisible(state, ['33'])).toMatchSnapshot();
      expect(osmStateGetVisible(state, ['121'])).toMatchSnapshot();
    });

    it('should add a modified relation', () => {
      const r1Hash1 = relationFactory({
        id: 'r1#1',
      });
      const state4 = osmStateAddModifieds(state, [r1Hash1]);
      expect(osmStateGetVisible(state4, ['33']).has(r1Hash1.id)).toBe(true);
      expect(state4).toMatchSnapshot();
    });
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

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const state2 = osmStateAddModifieds(state, [n1Hash0]);

    expect(state2).toEqual(osmStateAddModifieds(baseSetup(), [n1Hash0]));
  });
});

describe('osmStateGetNextId', () => {
  const baseSetup = () => {
    const s = osmStateCreate();
    osmStateAddVirgins(s, [n1, n2, w1], '123');
    return s;
  };

  it('should generate id', () => {
    let state = baseSetup();
    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    state = osmStateAddModifieds(state, [n1Hash0]);

    expect(osmStateGetNextId(state, n1Hash0.id)).toBe('n1#1');

    const n1Hash1 = nodeFactory({
      id: 'n1#1',
    });

    state = osmStateAddModifieds(state, [n1Hash1]);
    expect(osmStateGetNextId(state, n1Hash1.id)).toBe('n1#2');
  });

  it('looks for non colliding id in the element table', () => {
    const baseState = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });

    const state = osmStateAddModifieds(baseState, [n1Hash0]);

    expect(osmStateGetNextId(baseState, n1.id)).toBe('n1#1');

    expect(osmStateGetNextId(state, n1.id)).toBe('n1#1');
  });

  it('handles version newer the current', () => {
    const baseState = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const state1 = osmStateAddModifieds(baseState, [n1Hash0]);
    expect(osmStateGetNextId(state1, 'n1')).toBe('n1#1');
    expect(osmStateGetNextId(state1, 'n1#1')).toBe('n1#1');
    expect(osmStateGetNextId(state1, 'n1#100')).toBe('n1#1');
    expect(osmStateGetNextId(state1, 'n1#-1')).toBe('n1#1');
    expect(osmStateGetNextId(state1, 'n1#2')).toBe('n1#1');
  });

  it('handles branched states', () => {
    const baseState = baseSetup();

    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    const state1 = osmStateAddModifieds(baseState, [n1Hash0]);

    const n2Hash0 = nodeFactory({
      id: 'n2#0',
    });

    const n1Hash1 = {
      ...n1Hash0,
      id: osmStateGetNextId(baseState, n1Hash0.id),
    };

    const state2 = osmStateAddModifieds(state1, [n1Hash1, n2Hash0]);

    expect(osmStateGetNextId(baseState, 'n1')).toBe('n1#2');
    expect(osmStateGetNextId(state1, 'n1')).toBe('n1#2');
    expect(osmStateGetNextId(state2, 'n1#1')).toBe('n1#2');
    expect(osmStateGetNextId(state2, 'n2')).toBe('n2#1');
    expect(osmStateGetNextId(baseState, 'n2')).toBe('n2#1');
  });

  it('fills in missing versions in between element table', () => {
    const state = osmStateCreate();

    const n1Hash3 = nodeFactory({
      id: 'n1#3',
    });

    const n1Hash5 = nodeFactory({
      id: 'n1#5',
    });

    osmStateAddVirgins(state, [n1, n2, w1], '123');

    const branchedState1 = osmStateAddModifieds(state, [n1Hash5]);

    expect(osmStateGetNextId(branchedState1, 'n1#0')).toBe('n1#6');

    const branchedState2 = osmStateAddModifieds(state, [n1Hash3]);

    expect(osmStateGetNextId(branchedState2, 'n1#0')).toBe('n1#4');

    expect(osmStateGetNextId(state, 'n1#0')).toBe('n1#0');

    let branchedState3 = osmStateAddModifieds(state, [
      nodeFactory({ id: osmStateGetNextId(state, 'n1#0') }),
    ]);

    expect(osmStateGetNextId(branchedState3, 'n1#0')).toBe('n1#1');

    branchedState3 = osmStateAddModifieds(state, [
      nodeFactory({ id: osmStateGetNextId(branchedState3, 'n1#0') }),
    ]);

    expect(osmStateGetNextId(branchedState3, 'n1#0')).toBe('n1#2');

    branchedState3 = osmStateAddModifieds(state, [
      nodeFactory({ id: osmStateGetNextId(branchedState3, 'n1#0') }),
    ]);

    expect(osmStateGetNextId(branchedState3, 'n1#0')).not.toBe('n1#3');
    expect(osmStateGetNextId(branchedState3, 'n1#0')).toBe('n1#4');

    branchedState3 = osmStateAddModifieds(state, [
      nodeFactory({ id: osmStateGetNextId(branchedState3, 'n1#0') }),
    ]);

    expect(osmStateGetNextId(branchedState3, 'n1#0')).not.toBe('n1#5');
    expect(osmStateGetNextId(branchedState3, 'n1#0')).toBe('n1#6');
  });
});

describe('osmStateShred', () => {
  it('should loose virgin non base ids', () => {
    let state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, w1], '123');
    const n1Hash0 = nodeFactory({
      id: 'n1#0',
    });
    state = osmStateAddModifieds(state, [n1Hash0]);

    state = osmStateShred(state);

    expect(state[0].getQuadkeysTable()).toEqual(
      mapFromObj({
        '': setCreate(['n1#0']),
      })
    );

    expect([...state[0].getElementTable().keys()]).toEqual(['n1#0', 'n1']);
    expect(osmStateGetVisible(state, ['', '123']).size).toBe(1);
    expect(osmStateGetVisible(state, ['', '123'])).toMatchSnapshot();
  });

  it('should not delete nodes of modified ways', () => {
    let state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, n3, w1, n4], '123');
    const w1Hash0 = wayFactory({
      id: 'w1#0',
      nodes: ['n1', 'n3'],
    });

    expect(osmStateGetEntity(state, 'n4')).toBe(n4);

    state = osmStateAddModifieds(state, [w1Hash0]);

    state = osmStateShred(state);
    expect(osmStateGetEntity(state, 'n1')).toBe(n1);
    expect(osmStateGetEntity(state, 'n2')).toBe(n2);
    expect(osmStateGetEntity(state, 'n3')).toBe(n3);
    expect(osmStateGetEntity(state, 'n4')).toBe(undefined);

    expect(osmStateGetVisible(state, ['', '123'])).toMatchSnapshot();
  });

  it('should not delete nodes of nonlatest modified ways', () => {
    let state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, n3, w1, n4], '123');

    const w1Hash0 = wayFactory({
      id: 'w1#0',
      nodes: ['n3', 'n4'],
    });

    state = osmStateAddModifieds(state, [w1Hash0]);

    state = osmStateShred(state);
    expect(osmStateGetEntity(state, 'n1')).toBe(n1);
    expect(osmStateGetEntity(state, 'n2')).toBe(n2);
    expect(osmStateGetEntity(state, 'n3')).toBe(n3);
    expect(osmStateGetEntity(state, 'n4')).toBe(n4);
    expect(osmStateGetEntity(state, 'w1')).toBe(w1);
    expect(osmStateGetEntity(state, 'w1#0')).toBe(w1Hash0);

    expect(osmStateGetVisible(state, ['', '123'])).toMatchSnapshot();

    const w1Hash1 = wayFactory({
      id: 'w1#1',
      nodes: ['n1'],
    });

    state = osmStateAddModifieds(state, [w1Hash1]);
    state = osmStateShred(state);
    expect(osmStateGetEntity(state, 'n1')).toBe(n1);
    expect(osmStateGetEntity(state, 'n2')).toBe(n2);
    expect(osmStateGetEntity(state, 'n3')).toBe(n3);
    expect(osmStateGetEntity(state, 'n4')).toBe(n4);
    expect(osmStateGetEntity(state, 'w1')).toBe(w1);
    expect(osmStateGetEntity(state, 'w1#0')).toBe(w1Hash0);
    expect(osmStateGetEntity(state, 'w1#1')).toBe(w1Hash1);

    expect(osmStateGetVisible(state, ['', '123'])).toMatchSnapshot();
  });
});
