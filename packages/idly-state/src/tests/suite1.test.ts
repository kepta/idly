import { nodeFactory, wayFactory } from 'idly-common/lib/osm/entityFactory';
import { Entity, EntityType, Node, Way } from 'idly-common/lib/osm/structures';
import {
  stateAddModified,
  stateAddVirgins,
  stateCreate,
  stateGenNextId,
  stateGetEntity,
  stateGetVisibles,
  stateShred,
} from '../index';
import { DerivedTable } from '../state/derivedTable/index';
import { quadkeyGet } from '../state/virgin/index';
import { expectStable } from './expectStable';
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

const mapToKeys = <T>(map: Map<string, T> | ReadonlyMap<string, T>) => [
  ...map.keys(),
];

describe('from xml to final rendering', () => {
  it('starting snapshots', () => {
    const virginEntities = parseFixture('one.xml');
    const osmState = stateCreate();
    stateAddVirgins(osmState, virginEntities, '1');
    expect(osmState.virgin.elements.size).toBe(121);
    expect(mapToKeys(osmState.virgin.elements)).toMatchSnapshot();
    expect(osmState.derivedTable).toMatchSnapshot();
    expect(quadkeyGet(osmState.virgin.quadkeysTable, '1')).toMatchSnapshot();
    expect(osmState.log).toMatchSnapshot();
  });

  it('first, get visible', () => {
    const virginEntities = parseFixture('one.xml');
    const osmState = stateCreate();
    stateAddVirgins(osmState, virginEntities, '1');

    const visible1 = stateGetVisibles(osmState, ['1']);
    expect(mapToKeys(visible1)).toMatchSnapshot();
  });

  it('replaces all of the nodes of ways with other ways nodes', () => {
    const virginEntities = () => parseFixture('one.xml');
    const osmState = stateCreate();
    stateAddVirgins(osmState, virginEntities(), '123');

    const way: any = virginEntities().find(
      r => r.type === EntityType.WAY && r.id === 'w265149283'
    );

    const newNodes = way.nodes
      .map((id: string) => virginEntities().find(r => r.id === id))
      .map((n: Entity) =>
        nodeFactory({
          ...n,
          id: stateGenNextId(osmState, n.id),
        } as any)
      );
    const newWay = wayFactory({
      ...way,
      id: stateGenNextId(osmState, way.id),
      nodes: newNodes.map((r: Node) => r.id),
    } as Way);

    const newState = stateAddModified(osmState, [newWay, ...newNodes]);

    expect(stateGetEntity(newState, newWay.id)).toBe(newWay);
    expect(stateGetEntity(newState, newNodes[1].id) === newNodes[1]).toBe(true);

    const nnnn = stateShred(newState);

    // console.log('nnnn.modified.has', nnnn.modified.has('n2708095696'));
    expectStable(nnnn.modified).toMatchSnapshot();
    expect([nnnn.virgin, nnnn.log]).toMatchSnapshot();
  });

  describe('new states should not affect other state"s visibles', () => {
    const virginEntities = () => parseFixture('one.xml');
    const osmState = stateCreate();
    stateAddVirgins(osmState, virginEntities(), '123');

    const modifiedStates = [osmState];
    const initialVisibles = [
      derivedTableToJs(stateGetVisibles(osmState, ['123'])),
    ];

    for (let i = 0; i < 10; i++) {
      const prevState = modifiedStates[modifiedStates.length - 1];
      const newNodes = [
        nodeFactory({
          id: stateGenNextId(prevState, 'n2708095906'),
          tags: { m: 'nodified' },
        }),
        nodeFactory({
          id: stateGenNextId(prevState, 'n2708095924'),
          tags: { m: 'nodified' },
        }),
      ];
      const newState = stateAddModified(
        modifiedStates[modifiedStates.length - 1],
        newNodes
      );

      modifiedStates.push(newState);

      initialVisibles.push(
        derivedTableToJs(stateGetVisibles(newState, ['123']))
      );
    }
    it("the previous state's visible should not be altered", () => {
      let count = 0;
      for (const state of modifiedStates) {
        expect(derivedTableToJs(stateGetVisibles(state, ['123']))).toEqual(
          initialVisibles[count]
        );
        count++;
      }
    });

    it('id should not show up if looking up in previous osm state', () => {
      expect(stateGetEntity(osmState, 'n2708095924#3')).toBe(undefined);
    });

    it('the state having the id in its log should show up', () => {
      expect(stateGetEntity(modifiedStates[4], 'n2708095924#3')).toEqual(
        nodeFactory({
          id: 'n2708095924#3',
          tags: { m: 'nodified' },
        })
      );
    });

    it('should not modify old', () => {
      expect(osmState.modified.get('n2708095924#3')).toBe(undefined);
    });
  });
});
