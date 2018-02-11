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
): OsmElement => ({
  entity,
  parentRelations,
  parentWays,
});

describe('basic additions', () => {
  it('adds entities', () => {
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2], '');

    expect(state.getElementTable()).toEqual(
      new Map([['n1', dummyElement(n1)], ['n2', dummyElement(n2)]])
    );
  });

  it('adds parentways', () => {
    const state = osmStateCreate();
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
    const state = osmStateCreate();
    osmStateAddVirgins(state, [n1, n2, w2, w1, n3, r1, n4], '');
    expect(state.getElementTable()).toMatchSnapshot();
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
      expect(osmStateGetVisible(state1, ['33'], log3).get('n1')).toEqual(
        dummyElement(n1, setCreate(['w1', 'w2']))
      );
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

describe('parentWaysCalculate', () => {
  it('create a parent ways table', () => {
    expect(
      parentWaysTableCreate([
        wayFactory({
          id: 'w2',
          nodes: ['n1', 'n3'],
        }),
        nodeFactory({
          id: 'n1',
        }),
        wayFactory({
          id: 'w3',
          nodes: ['n1', 'n4'],
        }),
      ])
    ).toEqual(
      mapFromObj({
        n1: setCreate(['w2', 'w3']),
        n3: setCreate(['w2']),
        n4: setCreate(['w3']),
      })
    );
    expect(
      parentWaysTableCreate([
        wayFactory({
          id: 'w2',
          nodes: ['n1', 'n3'],
        }),
        nodeFactory({
          id: 'n1',
        }),
        wayFactory({
          id: 'w3',
          nodes: ['n1', 'n4'],
        }),
        relationFactory({
          id: 'r1',
          members: [{ id: 'w1', ref: 'w1' }],
        }),
      ])
    ).toEqual(
      mapFromObj({
        n1: setCreate(['w2', 'w3']),
        n3: setCreate(['w2']),
        n4: setCreate(['w3']),
      })
    );
  });

  it('should throw error when nodeRefs dont already exist in table', () => {
    const osmTable: OsmTable = mapFromObj({
      n1: dummyElement(n1),
      n2: dummyElement(n2),
      r1: dummyElement(r1),
      w3: dummyElement(w3),
    });

    expect(() =>
      osmTableApplyParentWays(osmTable, parentWaysTableCreate([w1, w3]))
    ).toThrowError();
  });

  describe('should insert into existing parentWays', () => {
    const startObj = {
      n1: dummyElement(n1, setCreate(['w2'])),
      n2: dummyElement(n2, setCreate(['w80', 'w81'])),
      n3: dummyElement(n3),
      n4: dummyElement(n4),
      r1: dummyElement(r1),
      w2: dummyElement(w2),
    };

    const osmTable: OsmTable = mapFromObj(startObj);

    const way = wayFactory({
      id: 'w100',
      nodes: [n1.id, n2.id],
    });

    const n2Ref = tableGet(osmTable, 'n2');
    const n3Ref = tableGet(osmTable, 'n3');

    osmTableApplyParentWays(osmTable, parentWaysTableCreate([way, n5]));

    it('should change the reference to entities that got updated', () => {
      expect(n2Ref).not.toBe(tableGet(osmTable, 'n2'));
    });

    it('should not touch entities which arent updated', () => {
      expect(n3Ref).toBe(tableGet(osmTable, 'n3'));
    });

    it('should not change ref if the same way is applied again', () => {
      const n1Ref2 = tableGet(osmTable, 'n1');
      const n2Ref2 = tableGet(osmTable, 'n2');

      const anotherWay = wayFactory({
        id: 'w101',
        nodes: [n3.id, n4.id],
      });

      osmTableApplyParentWays(
        osmTable,
        parentWaysTableCreate([n1, way, anotherWay, w2, n3])
      );
      expect(n1Ref2).toBe(tableGet(osmTable, 'n1'));
      expect(n2Ref2).toBe(tableGet(osmTable, 'n2'));
      expect(tableGet(osmTable, 'n4')).toEqual(
        dummyElement(n4, setCreate(['w101']))
      );
      expect(tableGet(osmTable, 'n3')).toEqual(
        dummyElement(n3, setCreate(['w2', 'w101']))
      );
    });

    expect(osmTable).toEqual(
      mapFromObj({
        ...startObj,
        n1: dummyElement(n1, setCreate(['w2', way.id])),
        n2: dummyElement(n2, setCreate(['w80', 'w81', way.id])),
      })
    );
  });
});

describe('parent relations', () => {
  it('should create parentRelations table', () => {
    expect(
      parentRelationsTableCreate([
        wayFactory({
          id: 'w2',
          nodes: ['n1', 'n3'],
        }),
        nodeFactory({
          id: 'n1',
        }),
        wayFactory({
          id: 'w3',
          nodes: ['n1', 'n4'],
        }),
        relationFactory({
          id: 'r1',
          members: [{ id: 'w1', ref: 'w1' }],
        }),
      ])
    ).toEqual(
      mapFromObj({
        w1: setCreate(['r1']),
      })
    );

    expect(
      parentRelationsTableCreate([
        wayFactory({
          id: 'w2',
          nodes: ['n1', 'n3'],
        }),
        nodeFactory({
          id: 'n1',
        }),
        relationFactory({
          id: 'r1',
          members: [{ id: 'w1', ref: 'w1' }],
        }),
        relationFactory({
          id: 'r2',
          members: [{ id: 'w1', ref: 'w1' }, { id: 'n1', ref: 'n1' }],
        }),
      ])
    ).toEqual(
      mapFromObj({
        n1: setCreate(['r2']),
        w1: setCreate(['r1', 'r2']),
      })
    );
  });

  it('should ignore the ref key of member', () => {
    expect(
      parentRelationsTableCreate([
        relationFactory({
          id: 'r1',
          members: [{ id: 'w1', ref: 'w2' }],
        }),
      ])
    ).toEqual(
      mapFromObj({
        w1: setCreate(['r1']),
      })
    );
  });

  it('should apply parent relations table', () => {
    const osmTable: OsmTable = mapFromObj({
      n1: dummyElement(n1),
      n4: dummyElement(n4),
      r1: dummyElement(r1),
      w2: dummyElement(w2),
    });

    osmTableApplyParentRelations(osmTable, parentRelationsTableCreate([r1]));

    expect(osmTable).toEqual(
      mapFromObj({
        n1: dummyElement(n1),
        n4: dummyElement(n4, undefined, setCreate(['r1'])),
        r1: dummyElement(r1),
        w2: dummyElement(w2, undefined, setCreate(['r1'])),
      })
    );
  });

  describe('should update the reference of elements when element is modified', () => {
    const osmTable: OsmTable = mapFromObj({
      n1: dummyElement(n1),
      n4: dummyElement(n4),
      r1: dummyElement(r1),
      w2: dummyElement(w2),
    });

    let w2Ref = tableGet(osmTable, 'w2');

    osmTableApplyParentRelations(osmTable, parentRelationsTableCreate([r1]));

    expect(tableGet(osmTable, 'w2')).not.toBe(w2Ref);
    expect(tableGet(osmTable, 'w2')).toEqual({
      ...w2Ref,
      parentRelations: setCreate(['r1']),
    });

    w2Ref = tableGet(osmTable, 'w2');

    it('should not change ref when same relation is repeated', () => {
      osmTableApplyParentRelations(
        osmTable,
        parentRelationsTableCreate([r1, r2])
      );

      expect(tableGet(osmTable, 'w2')).toBe(w2Ref);
      expect(tableGet(osmTable, 'w2')).toEqual(w2Ref);
    });
  });

  it('appends to existing ref of relation', () => {
    const osmTable: OsmTable = mapFromObj({
      n1: dummyElement(n1),
      n4: dummyElement(n4),
      r1: dummyElement(r1),
      w2: dummyElement(w2, undefined, setCreate(['r2', 'r3'])),
    });

    const w2Ref = tableGet(osmTable, 'w2');

    osmTableApplyParentRelations(
      osmTable,
      parentRelationsTableCreate([r2, r1])
    );

    expect(tableGet(osmTable, 'w2')).not.toBe(w2Ref);
    expect(tableGet(osmTable, 'w2')).toEqual({
      ...w2Ref,
      parentRelations: setCreate(['r1', 'r2', 'r3']),
    });
  });

  it('should not apply parent relations when ids dont exist in table', () => {
    const osmTable: OsmTable = mapFromObj({
      n1: dummyElement(n1),
      n2: dummyElement(n2),
      r1: dummyElement(r1),
      w2: dummyElement(w2),
    });

    osmTableApplyParentRelations(
      osmTable,
      parentRelationsTableCreate([r1, r3])
    );

    expect(tableGet(osmTable, 'n4')).toBe(undefined);

    expect(tableGet(osmTable, 'r1')).toEqual({
      ...dummyElement(r1),
      parentRelations: setCreate(['r3']),
    });

    expect(tableGet(osmTable, 'w2')).toEqual({
      ...dummyElement(w2),
      parentRelations: setCreate(['r1', 'r3']),
    });
  });
});
