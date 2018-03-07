import { setCreate } from '../../dataStructures/set';
import { tableGet } from '../../dataStructures/table/regular';
import {
  ancestorFind,
  QuadkeysTable,
  quadkeysTableAdd,
  quadkeysTableFindRelated,
  quadkeysTableGet,
  quadkeysTableRemoveAllDescendants,
} from './quadkeysTable';

const mapFromObj = (o: any): QuadkeysTable =>
  Object.keys(o).reduce((prev, k) => {
    prev.set(k, o[k]);
    return prev;
  }, new Map());

const dummyQuadkeyT = (obj: any) => mapFromObj(obj);
// tslint:disable:object-literal-key-quotes
describe('get quadkeys', () => {
  it('should get quadkey', () => {
    const table = mapFromObj({
      '210': setCreate(['a']),
      '212': setCreate(['b']),
    });
    expect(quadkeysTableGet(table, '210')).toEqual(setCreate(['a']));
    expect(quadkeysTableGet(table, '212')).toEqual(setCreate(['b']));
  });
  it('should get quadkey if all 4 direct children exist', () => {
    const table = mapFromObj({
      '210': setCreate(['a']),
      '211': setCreate(['b']),
      '212': setCreate(['c']),
      '213': setCreate(['d']),
    });
    expect(quadkeysTableGet(table, '21')).toEqual(
      setCreate(['a', 'b', 'c', 'd'])
    );
  });
  it('should fail if any child is missing', () => {
    const table = mapFromObj({
      '210': setCreate(['a']),
      '211': setCreate(['b']),
      '213': setCreate(['d']),
    });
    expect(quadkeysTableGet(table, '21')).toBe(undefined);
  });
  it('should  work if child is missing but parent is there', () => {
    const table = mapFromObj({
      '21': setCreate(['z']),
      '210': setCreate(['a']),
      '211': setCreate(['b']),
      '213': setCreate(['d']),
    });
    expect(quadkeysTableGet(table, '21')).toEqual(setCreate(['z']));
  });
  it('should get undefined for quadkeys bigger than QUADKEY_MAX_SIZE', () => {
    const table = mapFromObj({
      '121313212121212121212121212121313212121212121212121212': setCreate([
        'z',
      ]),
      '210': setCreate(['a']),
      '211': setCreate(['b']),
      '213': setCreate(['d']),
    });
    expect(quadkeysTableGet(table, '121313212121212121212121212')).toEqual(
      undefined
    );
  });
});

describe('removeAllDescendants', () => {
  const parse = (obj: any, r: any) => {
    const t = mapFromObj(obj);
    quadkeysTableRemoveAllDescendants(t, r);
    return [...t.keys()].sort();
  };

  const expected = (obj: any, removed: string[]) =>
    Object.keys(obj)
      .filter(r => removed.indexOf(r) === -1)
      .sort();
  it('should remove all related', () => {
    const obj = {
      '': setCreate(),
      '12': setCreate(),
      '123': setCreate(),
      '2': setCreate(),
      '210': setCreate(),
      '212': setCreate(),
      '213': setCreate(),
      '3123': setCreate(),
    };

    expect(parse(obj, '1')).toEqual(expected(obj, ['123', '12']));
  });

  it('should not remove self', () => {
    const obj = {
      '': setCreate(),
      '12': setCreate(),
      '123': setCreate(),
      '2': setCreate(),
      '210': setCreate(),
      '212': setCreate(),
      '213': setCreate(),
      '3123': setCreate(),
    };
    expect(parse(obj, '123')).toEqual(expected(obj, []));
  });

  it('should not remove neighbours', () => {
    const obj = {
      '': setCreate(),
      '12': setCreate(),
      '123': setCreate(),
      '2': setCreate(),
      '210': setCreate(),
      '212': setCreate(),
      '2120': setCreate(),
      '21201': setCreate(),
      '213': setCreate(),
      '2130': setCreate(),
      '21301': setCreate(),
      '3123': setCreate(),
    };
    expect(parse(obj, '212')).toEqual(expected(obj, ['2120', '21201']));
  });

  it('should remove everything when removing root', () => {
    const obj = {
      '': setCreate(),
      '12': setCreate(),
      '123': setCreate(),
      '2': setCreate(),
      '210': setCreate(),
      '212': setCreate(),
      '2120': setCreate(),
      '21201': setCreate(),
      '213': setCreate(),
      '2130': setCreate(),
      '21301': setCreate(),
      '3123': setCreate(),
    };
    expect(parse(obj, '')).toEqual(
      expected(obj, [
        '12',
        '123',
        '2',
        '210',
        '212',
        '2120',
        '21201',
        '213',
        '2130',
        '21301',
        '3123',
      ])
    );
  });
});

describe('findAncestor', () => {
  it('should return any one of the ancestors ', () => {
    const table = mapFromObj({
      '': setCreate(),
      '12': setCreate(),
      '123': setCreate(),
      '210': setCreate(),
      '212': setCreate(),
      '2120': setCreate(),
      '21201': setCreate(),
      '213': setCreate(),
      '2130': setCreate(),
      '21301': setCreate(),
      '3123': setCreate(),
    });
    expect(ancestorFind(table, '2120121201')).toEqual('212');
  });
  it('should not return empty string as ancestor', () => {
    const table = mapFromObj({
      '': setCreate(),
    });
    expect(ancestorFind(table, '2120121201')).toEqual(undefined);
  });
});

describe('quadkeysTableAdd', () => {
  it('should work', () => {
    const t = dummyQuadkeyT({
      '01': setCreate(['n1']),
      '21': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n3'], '3');
    expect(t).toEqual(
      dummyQuadkeyT({
        '01': setCreate(['n1']),
        '21': setCreate(['n2']),
        '3': setCreate(['n3']),
      })
    );
  });

  it('should not remove any descendant on adding', () => {
    const t = dummyQuadkeyT({
      '01': setCreate(['n1']),
      '21': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n3', 'n1'], '0');
    expect(t).toEqual(
      dummyQuadkeyT({
        '0': setCreate(['n3', 'n1']),
        '01': setCreate(['n1']),
        '21': setCreate(['n2']),
      })
    );
  });

  it('should not remove sibbling', () => {
    const t = dummyQuadkeyT({
      '01': setCreate(['n1']),
      '02': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n3', 'n1'], '03');
    expect(t).toEqual(
      dummyQuadkeyT({
        '01': setCreate(['n1']),
        '02': setCreate(['n2']),
        '03': setCreate(['n3', 'n1']),
      })
    );
  });

  it('should add if ancestor exists', () => {
    const t = dummyQuadkeyT({
      '01': setCreate(['n1']),
      '02': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n3', 'n1', 'n4'], '020');
    expect(t).toEqual(
      dummyQuadkeyT({
        '01': setCreate(['n1']),
        '02': setCreate(['n2']),
        '020': setCreate(['n3', 'n1', 'n4']),
      })
    );
  });

  it('should replace the current virgin entities in the existing same quadkey', () => {
    const t = dummyQuadkeyT({
      '': setCreate(),
      '01': setCreate(['n1']),
      '02': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n3', 'n1'], '02');
    expect(t).toEqual(
      dummyQuadkeyT({
        '': setCreate(),
        '01': setCreate(['n1']),
        '02': setCreate(['n3', 'n1']),
      })
    );
  });
  it('should handle global quadkey used for modified entities', () => {
    const t = dummyQuadkeyT({
      '01': setCreate(['n1']),
      '02': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n3#0', 'n1#0'], '');
    expect(t).toEqual(
      dummyQuadkeyT({
        '': setCreate(['n3#0', 'n1#0']),
        '01': setCreate(['n1']),
        '02': setCreate(['n2']),
      })
    );
  });

  it('should insert modified entities to already exist root quadkey', () => {
    const t = dummyQuadkeyT({
      '': setCreate(['n3#0', 'n1#0']),
      '01': setCreate(['n1']),
      '02': setCreate(['n2']),
    });
    quadkeysTableAdd(t, ['n1#1'], '');
    expect(t).toEqual(
      dummyQuadkeyT({
        '': setCreate(['n3#0', 'n1#0', 'n1#1']),
        '01': setCreate(['n1']),
        '02': setCreate(['n2']),
      })
    );
  });
});

describe('quadkeysTableFindVirginIds', () => {
  it('should return empty for root quadkey as it only stores modified Ids', () => {
    const t = dummyQuadkeyT({
      '': setCreate(['n1#0']),
      '21': setCreate(['n2']),
      '3': setCreate(['n3']),
    });
    expect(quadkeysTableFindRelated(t, [''])).toEqual(setCreate());
    expect(tableGet('', t)).toEqual(setCreate(['n1#0']));
  });

  it('should return virgin Ids ', () => {
    const t = dummyQuadkeyT({
      '': setCreate(),
      '12': setCreate(['n1', 'n2', 'n5', 'n4', 'n3']),
      '210': setCreate(['r1', 'n6']),
      '212': setCreate(['r2', 'n7']),
    });
    expect(quadkeysTableFindRelated(t, ['21'])).toEqual(
      setCreate(['r1', 'n6', 'r2', 'n7'])
    );
    expect(quadkeysTableFindRelated(t, ['12'])).toEqual(
      setCreate(['n1', 'n2', 'n5', 'n4', 'n3'])
    );
  });
});
