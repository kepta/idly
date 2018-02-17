import {
  nodeFactory,
  wayFactory,
} from 'idly-common/lib/osm/entityFactory/index';
import { Entity } from 'idly-common/lib/osm/structures';
import { setCreate } from '../helper';
import { State } from './state';

const mapFromObj = <T>(o: any = {}): Map<string, T> =>
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

const w1 = wayFactory({
  id: 'w1',
  nodes: ['n1', 'n2'],
});

const getId = (r: any) => r.id;
describe('constructing state and basic tests', () => {
  it('should create', () => {
    expect(State.create()).toEqual({
      _elementTable: mapFromObj(),
      _metaTable: mapFromObj(),
      _quadkeysTable: mapFromObj(),
    });
  });
  it('should create with given values', () => {
    const state = State.create<Entity>();
    state.add(getId, [n1, n2, w1], '123');
    expect(state).toMatchSnapshot();
  });
});

describe('getVisible', () => {
  describe('should get ids', () => {
    const state = State.create<Entity>();
    state.add(getId, [n1, n2, w1], '123');

    state.add(getId, [n3], '121');
    state.add(getId, [n4], '130');

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

    state.add(getId, [n1Hash0, n2Hash0, w1Hash0], '');

    expect(state.getQuadkey('')).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0].map(e => e.id))
    );

    expect(state.getVisible(['121'])).toEqual(setCreate([n3].map(e => e.id)));

    expect(state.getVisible(['130'])).toEqual(setCreate([n4].map(e => e.id)));

    expect(state.getVisible(['1'])).toEqual(
      setCreate([n1, n2, n3, n4, w1].map(e => e.id))
    );

    it('repeating state.add shouldnt affect', () => {
      state.add(getId, [n1Hash0, n2Hash0, w1Hash0], '');
      expect(state.getQuadkey('')).toEqual(
        setCreate([n2Hash0, w1Hash0, n1Hash0].map(e => e.id))
      );
      state.add(getId, [n3], '121');
      expect(state.getVisible(['121'])).toEqual(setCreate([n3].map(e => e.id)));
      state.getVisible([]);
    });
  });

  describe('should handle ids belonging to multiple quadkeys', () => {
    const state = State.create<Entity>();
    state.add(t => t.id, [n1, n2], '123');
    state.add(t => t.id, [w1], '122');

    expect(state.getVisible(['123'])).toEqual(setCreate(['n1', 'n2']));
    expect(state.getVisible(['122'])).toEqual(setCreate(['w1']));
    it('should not insert quadkey whose parent already exists', () => {
      state.add(t => t.id, [n3], '1234');
      expect(state.getVisible(['1234'])).toEqual(setCreate(['n1', 'n2']));
      expect(state.getElement('n3')).toEqual(n3);
    });
  });
});

describe('add', () => {
  it('doesnt overwrite existing elements', () => {
    const state = State.create<Entity>();
    state.add(r => r.id, [n1, n2, w1], '123');

    const n1Other = nodeFactory({
      id: 'n1',
    });

    expect(n1Other).not.toBe(n1);

    state.add(r => r.id, [n1Other], '12');

    expect(state.getElement('n1')).toBe(n1);
  });
});

// describe('shred', () => {
//   it('shouldnt change existing state', () => {
//     const state = State.create<Entity>();
//     state.add(t => t.id, [n1, n2], '12301201');
//     state.add(t => t.id, [w1], '12101200');
//     state.add(t => t.id, [w1, w2], '110231121');
//     state.add(t => t.id, [w3, r2], '100231121');
//     // console.log(JSON.stringify(state));
//     state.shred('12');

//     expect(state).toEqual(
//       (s => {
//         s.add(t => t.id, [n1, n2], '12301201');
//         s.add(t => t.id, [w1], '12101200');
//         s.add(t => t.id, [w1, w2], '110231121');
//         s.add(t => t.id, [w3, r2], '100231121');
//         return s;
//       })(State.create<Entity>())
//     );
//     state.shred('');
//     expect(state).toEqual(
//       (s => {
//         s.add(t => t.id, [n1, n2], '12301201');
//         s.add(t => t.id, [w1], '12101200');
//         s.add(t => t.id, [w1, w2], '110231121');
//         s.add(t => t.id, [w3, r2], '100231121');
//         return s;
//       })(State.create<Entity>())
//     );

//     expect(state.shred('100')).toMatchSnapshot();
//   });
//   it('should loose weight', () => {
//     let state = State.create<Entity>();
//     state.add(t => t.id, [n1, n2], '12301201');
//     state.add(t => t.id, [w1], '12101200');
//     state.add(t => t.id, [n3], '');
//     state.add(t => t.id, [w1, w2], '110231121');
//     state.add(t => t.id, [w3, r2], '100231121');
//     state.add(t => t.id, [w3, r2], '100131121');
//     state.add(t => t.id, [n5, n6, r2], '131');

//     state = state.shred('100');

//     expect(state).toEqual(
//       (s => {
//         s.add(t => t.id, [w3, r2], '100231121');
//         s.add(t => t.id, [w3, r2], '100131121');
//         return s;
//       })(State.create<Entity>())
//     );

//     state.add(t => t.id, [w3, r2], '100131121');
//     state.add(t => t.id, [w1], '12101200');
//     state.add(t => t.id, [n5, n6, r2], '131');

//     expect(state.shred('1')).toEqual(state);
//   });
// });
