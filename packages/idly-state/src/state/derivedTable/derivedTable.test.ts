import {
  nodeFactory,
  relationFactory,
  wayFactory,
} from 'idly-common/lib/osm/entityFactory';

import { setCreate } from '../../dataStructures/set';
import { derivedTableUpdate } from './index';

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

const n7 = nodeFactory({
  id: 'n7',
});

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

const mapFromObj = (o: any): Map<string, any> =>
  Object.keys(o).reduce((prev, k) => {
    prev.set(k, o[k]);
    return prev;
  }, new Map());

describe('derived values', () => {
  it('it throws error when way node doesnt exist', () => {
    const entityTable = mapFromObj({
      n1,
      r1,
      w1,
    });
    expect(() => derivedTableUpdate(entityTable)).toThrowError();
    // expect(derived.get('n1').parentWays).toEqual(setCreate(['w1']));

    // expect(derivedTableUpdate(entityTable)).toMatchSnapshot();
  });

  it('it handles relations whose members dont exist', () => {
    const entityTable = mapFromObj({
      n1,
      r1,
    });
    expect(() => derivedTableUpdate(entityTable)).not.toThrowError();
    // expect(derived.get('n1').parentWays).toEqual(setCreate(['w1']));

    // expect(derivedTableUpdate(entityTable)).toMatchSnapshot();
  });

  it('should mark parents correctly', () => {
    const entityTable = mapFromObj({
      n1,
      n2,
      n3,
      n4,
      n5,
      n6,
      n7,
      r1,
      r2,
      r3,
      w1,
      w2,
      w3,
    });
    const derived = derivedTableUpdate(entityTable);

    const parentWays: any = {};
    const parentRelations: any = {};

    derived.forEach(c => {
      parentWays[c.entity.id] = c.parentWays;
      parentRelations[c.entity.id] = c.parentRelations;
    });

    expect(parentWays).toMatchSnapshot();
    expect(parentRelations).toMatchSnapshot();
  });

  it('should remove entity if not found in the new table ', () => {
    let entityTable: any = mapFromObj({
      n1,
      n2,
      n3,
      n5,
      r1,
      w2,
    });

    const derived: any = derivedTableUpdate(entityTable);

    expect(derived.get('n1').parentWays).toEqual(setCreate(['w2']));

    entityTable = mapFromObj({
      n1,
      n3,
      n5,
      r1,
      w2,
    });

    const derived2 = derivedTableUpdate(entityTable, derived);
    expect(derived2.get('n1')).toBe(derived.get('n1'));
    expect(derived2.get('n5')).toBe(derived.get('n5'));

    expect(derived2.get('n2')).toBe(undefined);
  });

  it('should update the previous derived table if derived value changes', () => {
    let entityTable = mapFromObj({
      n1,
      n3,
      n4,
      n5,
      r1,
      w2,
      w3,
    });

    const baseDerivedTable = derivedTableUpdate(entityTable);
    expect(baseDerivedTable.get('n5')).toEqual({
      entity: n5,
      parentRelations: setCreate([]),
      parentWays: setCreate(['w3']),
    });

    entityTable = mapFromObj({
      n1,
      n3,
      n5,
      r1,
      w2,
    });

    const derived2 = derivedTableUpdate(entityTable, baseDerivedTable);

    expect(derived2.get('n5')).toEqual(baseDerivedTable.get('n5'));
    expect(derived2.get('n5')).toEqual({
      entity: n5,
      parentRelations: setCreate([]),
      parentWays: setCreate([]),
    });

    const newRelation = relationFactory({
      id: 'r55',
      members: [n1, n5, r1, w2, w3].map(e => ({ id: e.id, ref: e.id })),
    });

    const derived3 = derivedTableUpdate(
      mapFromObj({
        n1,
        n3,
        n4,
        n5,
        r1,
        r55: newRelation,
        w2,
        w3,
      }),
      baseDerivedTable
    );

    const parentWays: any = {};
    const parentRelations: any = {};

    derived3.forEach(c => {
      parentWays[c.entity.id] = c.parentWays;
      parentRelations[c.entity.id] = c.parentRelations;
    });

    expect(parentWays).toMatchSnapshot();
    expect(parentRelations).toMatchSnapshot();
    expect(baseDerivedTable).toMatchSnapshot();

    const derived5 = derivedTableUpdate(mapFromObj({}), baseDerivedTable);

    expect(derived5.size).toBe(0);
  });

  it('keeps the reference same when not modified', () => {
    let entityTable = mapFromObj({
      n1,
      n2,
      n3,
      n4,
      n5,
      n6,
      n7,
      r1,
      r2,
      r3,
      w1,
      w2,
      w3,
    });
    const derived = derivedTableUpdate(entityTable);

    entityTable = mapFromObj({
      n1,
      n2,
      n3,
      n4,
      n5,
      n6,
      n7,
      r1,
      r2,
      r3,
      w2,
      w3,
    });

    const derived2 = derivedTableUpdate(entityTable, derived);

    expect((derived2.get('n1') as any).parentWays).toEqual(setCreate(['w2']));
    expect((derived2.get('n2') as any).parentWays).toEqual(setCreate());

    expect(derived2.get('n3') as any).toBe(derived.get('n3') as any);
    expect(derived2.get('n4') as any).toBe(derived.get('n4') as any);
    expect(derived2.get('n5') as any).toBe(derived.get('n5') as any);
    expect(derived2.get('n6') as any).toBe(derived.get('n6') as any);
    expect(derived2.get('n7') as any).toBe(derived.get('n7') as any);
    expect(derived2.get('r1') as any).toBe(derived.get('r1') as any);
    expect(derived2.get('r2') as any).toBe(derived.get('r2') as any);
    expect(derived2.get('r3') as any).toBe(derived.get('r3') as any);
    expect(derived2.get('w2') as any).toBe(derived.get('w2') as any);
    expect(derived2.get('w3') as any).toBe(derived.get('w3') as any);

    expect((derived2.get('n3') as any).parentWays).toBe(
      (derived.get('n3') as any).parentWays
    );
    expect((derived2.get('n4') as any).parentWays).toBe(
      (derived.get('n4') as any).parentWays
    );
    expect((derived2.get('n5') as any).parentWays).toBe(
      (derived.get('n5') as any).parentWays
    );
    expect((derived2.get('n6') as any).parentWays).toBe(
      (derived.get('n6') as any).parentWays
    );
    expect((derived2.get('n7') as any).parentWays).toBe(
      (derived.get('n7') as any).parentWays
    );
    expect((derived2.get('r1') as any).parentWays).toBe(
      (derived.get('r1') as any).parentWays
    );
    expect((derived2.get('r2') as any).parentWays).toBe(
      (derived.get('r2') as any).parentWays
    );
    expect((derived2.get('r3') as any).parentWays).toBe(
      (derived.get('r3') as any).parentWays
    );
    expect((derived2.get('w2') as any).parentWays).toBe(
      (derived.get('w2') as any).parentWays
    );
    expect((derived2.get('w3') as any).parentWays).toBe(
      (derived.get('w3') as any).parentWays
    );
  });

  describe('should update the previous derived table if derived value changes 2', () => {
    let entityTable = mapFromObj({
      n1,
      n2,
      n3,
      n4,
      n5,
      n6,
      n7,
      r1,
      r2,
      r3,
      w1,
      w2,
      w3,
    });
    const derivedTable = derivedTableUpdate(entityTable);

    const w1Ref = derivedTable.get('w1');
    const r1Ref = derivedTable.get('r1');

    const n1Ref = derivedTable.get('n1');
    const n3Ref = derivedTable.get('n3');
    const n4Ref = derivedTable.get('n4');
    const n5Ref = derivedTable.get('n5');

    entityTable = mapFromObj({
      n1,
    });

    const compute1 = derivedTableUpdate(entityTable, derivedTable);

    const n1Ref2 = compute1.get('n1');
    expect(compute1.size).toBe(1);
    expect(compute1.get('n1')).toMatchSnapshot();

    it('updates the derived table when n1 is modified', () => {
      expect(derivedTable.get('n1')).not.toBe(n1Ref);
    });

    it('keeps other elements in derived table intact', () => {
      expect(derivedTable.get('w1')).toBe(w1Ref);
      expect(derivedTable.get('n3')).toBe(n3Ref);
    });

    derivedTableUpdate(
      mapFromObj({
        n1,
        n2,
        n3,
        n4,
        n5,
        n6,
        n7,
        r1,
        r2,
        r3,
        w1,
        w2,
        w3,
      }),
      derivedTable
    );
    it('changes the n1 ref ', () => {
      expect(derivedTable.get('n1')).not.toBe(n1Ref);
      expect(derivedTable.get('n1')).not.toBe(n1Ref2);
    });

    it('reverts n1 value back to the original', () => {
      expect(derivedTable.get('n1')).not.toEqual(n1Ref2);
      expect(derivedTable.get('n1')).toEqual(n1Ref);
    });

    it('keeps other elements in derived table intact', () => {
      expect(derivedTable.get('w1')).toBe(w1Ref);
      expect(derivedTable.get('n3')).toBe(n3Ref);
      expect(derivedTable.get('n4')).toBe(n4Ref);
      expect(derivedTable.get('n5')).toBe(n5Ref);
      expect(derivedTable.get('r1')).toBe(r1Ref);
    });
  });
});
