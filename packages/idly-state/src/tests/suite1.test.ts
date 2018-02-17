import { nodeFactory, wayFactory } from 'idly-common/lib/osm/entityFactory';
import { EntityType, Way } from 'idly-common/lib/osm/structures';
import {
  OsmState,
  osmStateAddModifieds,
  osmStateAddVirgins,
  osmStateCreate,
  osmStateGetEntity,
  osmStateGetNextId,
  osmStateGetVisible,
  osmStateShred,
} from '../osmState';
import { DerivedTable } from '../osmState/derivedTable';
import { parseFixture } from './helpers';

const derivedTableToJs = (d: DerivedTable) =>
  [...d].map(([k, v]) => [
    k,
    {
      entity: JSON.parse(JSON.stringify(v.entity)),
      parentRelations: [...v.parentRelations],
      parentWays: [...v.parentWays],
    },
  ]);

const getLog = (state: OsmState) => state[1];
const getState = (state: OsmState) => state[0];
const mapToKeys = <T>(map: Map<string, T> | ReadonlyMap<string, T>) => [
  ...map.keys(),
];

describe('from xml to final rendering', () => {
  it('starting snapshots', () => {
    const virginEntities = parseFixture('one.xml');
    const osmState = osmStateCreate();
    osmStateAddVirgins(osmState, virginEntities, '1');
    const state = getState(osmState);
    expect(state.getElementTable().size).toBe(121);
    expect(mapToKeys(state.getElementTable())).toMatchSnapshot();
    expect(state.getMetaTable()).toMatchSnapshot();
    expect(state.getQuadkey('1')).toMatchSnapshot();
    expect(getLog(osmState)).toMatchSnapshot();
  });

  it('first, get visible', () => {
    const virginEntities = parseFixture('one.xml');
    const osmState = osmStateCreate();
    osmStateAddVirgins(osmState, virginEntities, '1');

    const visible1 = osmStateGetVisible(osmState, ['1']);
    expect(mapToKeys(visible1)).toMatchSnapshot();
  });

  it('replaces all of the nodes of ways with other ways nodes', () => {
    const virginEntities = () => parseFixture('one.xml');
    const osmState = osmStateCreate();
    osmStateAddVirgins(osmState, virginEntities(), '123');

    const way: any = virginEntities().find(
      r => r.type === EntityType.WAY && r.id === 'w265149283'
    );

    const newNodes = way.nodes
      .map(id => virginEntities().find(r => r.id === id))
      .map(n =>
        nodeFactory({
          ...n,
          id: osmStateGetNextId(osmState, n.id),
        } as any)
      );

    const newWay = wayFactory({
      ...way,
      id: osmStateGetNextId(osmState, way.id),
      nodes: newNodes.map(r => r.id),
    } as Way);

    const newState = osmStateAddModifieds(osmState, [newWay, ...newNodes]);

    expect(osmStateGetEntity(newState, newWay.id)).toBe(newWay);
    expect(osmStateGetEntity(newState, newNodes[0].id)).toBe(newNodes[0]);

    expect(osmStateShred(newState)).toMatchSnapshot();
  });

  describe('new states should not affect other state"s visibles', () => {
    const virginEntities = () => parseFixture('one.xml');
    const osmState = osmStateCreate();
    osmStateAddVirgins(osmState, virginEntities(), '123');

    const modifiedStates = [osmState];
    const initialVisibles = [
      derivedTableToJs(osmStateGetVisible(osmState, ['123'])),
    ];

    for (let i = 0; i < 10; i++) {
      const prevState = modifiedStates[modifiedStates.length - 1];
      const newNodes = [
        nodeFactory({
          id: osmStateGetNextId(prevState, 'n2708095906'),
          tags: { m: 'nodified' },
        }),
        nodeFactory({
          id: osmStateGetNextId(prevState, 'n2708095924'),
          tags: { m: 'nodified' },
        }),
      ];
      const newState = osmStateAddModifieds(
        modifiedStates[modifiedStates.length - 1],
        newNodes
      );

      modifiedStates.push(newState);

      initialVisibles.push(
        derivedTableToJs(osmStateGetVisible(newState, ['123']))
      );
    }
    it("the previous state's visible should not be altered", () => {
      let count = 0;
      for (const state of modifiedStates) {
        expect(derivedTableToJs(osmStateGetVisible(state, ['123']))).toEqual(
          initialVisibles[count]
        );
        count++;
      }
    });

    it('id should not show up if looking up in previous osm state', () => {
      expect(osmStateGetEntity(osmState, 'n2708095924#3')).toBe(undefined);
    });

    it('the state having the id in its log should show up', () => {
      expect(osmStateGetEntity(modifiedStates[4], 'n2708095924#3')).toEqual(
        nodeFactory({
          id: 'n2708095924#3',
          tags: { m: 'nodified' },
        })
      );
    });

    it('internally the State should be modified', () => {
      expect(osmState[0].getElement('n2708095924#3')).not.toBe(undefined);
    });
  });

  describe('branching the history should not afffect states visibiles ', () => {
    const virginEntities = () => parseFixture('one.xml');
    const osmState = osmStateCreate();
    osmStateAddVirgins(osmState, virginEntities(), '123');

    const initialStates = [osmState];
    const initialVisibles = [
      derivedTableToJs(osmStateGetVisible(osmState, ['123'])),
    ];

    for (let i = 0; i < 4; i++) {
      const prevState = initialStates[initialStates.length - 1];
      const newNodes = [
        nodeFactory({
          id: osmStateGetNextId(prevState, 'n2708095906'),
          tags: { m: 'nodified' },
        }),
        nodeFactory({
          id: osmStateGetNextId(prevState, 'n2708095924'),
          tags: { m: 'nodified' },
        }),
      ];
      const newState = osmStateAddModifieds(
        initialStates[initialStates.length - 1],
        newNodes
      );

      initialStates.push(newState);
      initialVisibles.push(
        derivedTableToJs(osmStateGetVisible(newState, ['123']))
      );
    }

    // branching off from a particular state
    const branchedStates = [initialStates[2]];
    const branchedVisibles = [
      derivedTableToJs(osmStateGetVisible(initialStates[2], ['123'])),
    ];

    for (let i = 0; i < 4; i++) {
      const prevState = branchedStates[branchedStates.length - 1];
      const newNodes = [
        nodeFactory({
          id: osmStateGetNextId(prevState, 'n2708095906'),
          tags: { m: 'nodified' },
        }),
        nodeFactory({
          id: osmStateGetNextId(prevState, 'n2708095924'),
          tags: { m: 'nodified' },
        }),
      ];
      const newState = osmStateAddModifieds(
        branchedStates[branchedStates.length - 1],
        newNodes
      );

      branchedStates.push(newState);
      branchedVisibles.push(
        derivedTableToJs(osmStateGetVisible(newState, ['123']))
      );
    }

    it('the intial states visible should not be altered', () => {
      let count = 0;
      for (const state of initialStates) {
        expect(derivedTableToJs(osmStateGetVisible(state, ['123']))).toEqual(
          initialVisibles[count]
        );
        count++;
      }
    });

    it('the branched states visible should not be altered', () => {
      let count = 0;
      for (const state of branchedStates) {
        expect(derivedTableToJs(osmStateGetVisible(state, ['123']))).toEqual(
          branchedVisibles[count]
        );
        count++;
      }
    });

    it('next id generation should be same in all historic states', () => {
      for (const state of branchedStates) {
        expect(osmStateGetNextId(state, 'n2708095906')).toBe(
          osmStateGetNextId(osmState, 'n2708095906')
        );
      }
      for (const state of initialStates) {
        expect(osmStateGetNextId(state, 'n2708095906')).toBe(
          osmStateGetNextId(osmState, 'n2708095906')
        );
      }
    });
  });
});
