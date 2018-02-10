import { nodeFactory, wayFactory } from '../../osm/entityFactory/index';
import { setCreate } from '../helper';
import { addEntryToLog, logCreate } from '../log/index';

import {
  OsmElement,
  osmStateAddModifieds,
  osmStateAddVirgins,
} from '../osmState/osmTable';
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

describe('constructing state and basic tests', () => {
  it('should create', () => {
    expect(State.create()).toEqual({
      _elementTable: mapFromObj(),
      _quadkeysTable: mapFromObj(),
    });
  });
  it('should create with given values', () => {
    const state = State.create<OsmElement>();
    osmStateAddVirgins(state, [n1, n2, w1], '123');
    expect(state).toMatchSnapshot();
  });
});

describe('getVisible', () => {
  it('should get ids', () => {
    const baseSetup = () => {
      const s = State.create<OsmElement>();
      osmStateAddVirgins(s, [n1, n2, w1], '123');
      return s;
    };

    const log1 = logCreate();

    const state = baseSetup();
    osmStateAddVirgins(state, [n3], '121');
    osmStateAddVirgins(state, [n4], '130');

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

    osmStateAddModifieds(state, log2, [n1Hash0, n2Hash0, w1Hash0]);

    expect(state.getVisible(['123'], log2)).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0].map(e => e.id))
    );

    expect(state.getVisible(['121'], log2)).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0, n3].map(e => e.id))
    );

    expect(state.getVisible(['130'], log2)).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0, n4].map(e => e.id))
    );

    expect(state.getVisible(['1'], log2)).toEqual(
      setCreate([n2Hash0, w1Hash0, n1Hash0, n3, n4].map(e => e.id))
    );
  });
});
