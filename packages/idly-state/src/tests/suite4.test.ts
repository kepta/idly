import { nodeFactory } from 'idly-common/lib/osm/entityFactory';
import { Way } from 'idly-common/lib/osm/structures';
import { setCreate } from '../dataStructures/set';
import { Table } from '../dataStructures/table';
import { nodeMove } from '../editing/nodeMove';
import {
  stateAddModified,
  stateAddVirgins,
  stateCreate,
  stateGetVisibles,
} from '../index';
import { OsmState } from '../type';
import { expectStable } from './expectStable';
import { parseFixture } from './helpers';

const set = setCreate;
function getRelevantEntities<T>(t: Table<T>) {
  const newMap: Map<string, T> = new Map();
  t.forEach((e, k) => {
    if (e && relevantEntities.some(rel => k === rel || k.startsWith(rel))) {
      newMap.set(k, e);
    }
  });
  // produces a stable map
  return new Map(Array.from(newMap).sort((a, b) => a[0].localeCompare(b[0])));
}

const relevantVisibles = (state: OsmState, quadkey: string[]) =>
  getRelevantEntities(stateGetVisibles(state, quadkey));

const relevantVisibleKeys = (state: OsmState, quadkey: string[]) =>
  set(getRelevantEntities(stateGetVisibles(state, quadkey)).keys());

const nodeA = 'n596775900';
const nodeB = 'n42436703';
const wayA = 'w497165753';
const wayB = 'w458180192';
const wayC = 'w497165756';
const buildingBWithNodeB = 'w109287832';

const trWithWayA = 'r7297408';
const trWithWayB = 'r6247413';
const relationBWithBuildingB = 'r5594260';
const relevantEntities = [
  nodeA,
  nodeB,
  wayA,
  wayB,
  wayC,
  buildingBWithNodeB,
  trWithWayA,
  trWithWayB,
  relationBWithBuildingB,
];

/**
 *          |            |
 *          |            |
 * WayB-----A------------B------------------- WayB
 *          |            |   B---------------
 *          |            |   | buildingB-With-NodeB
 *          |wayA    wayC|   |
 */

describe('move nodeB then A then B', () => {
  const virginEntities = parseFixture('four.xml');

  let osmState = stateCreate();

  osmState = stateAddVirgins(osmState, virginEntities, '321');

  // we wanna fix this
  it('throws error if never asked for visible', () => {
    expect(() =>
      nodeMove(osmState, nodeB, {
        lat: 40.75902241791539,
        lon: -73.9724320178147,
      })
    ).toThrowError();
  });

  it('move nodeB ', () => {
    // TOFIX make this optional
    relevantVisibleKeys(osmState, ['321']);

    const modifiedArray = nodeMove(osmState, nodeB, {
      lat: 40.75902241791539,
      lon: -73.9724320178147,
    });

    expect(set(modifiedArray.map(r => r.id))).toEqual(
      set([
        `${nodeB}#0`,
        `${buildingBWithNodeB}#0`,
        `${wayB}#0`,
        `${wayC}#0`,
        `${relationBWithBuildingB}#0`,
        `${trWithWayB}#0`,
      ])
    );

    osmState = stateAddModified(osmState, [...modifiedArray]);
  });

  it('has the correct state', () => {
    expect(osmState.modified).toMatchSnapshot();
    expect(osmState.log).toMatchSnapshot();

    expect(relevantVisibleKeys(osmState, ['321'])).toMatchSnapshot();
    expect(relevantVisibles(osmState, ['321'])).toMatchSnapshot();
  });

  it('move nodeA', () => {
    const modifiedArray = nodeMove(osmState, nodeA, {
      lat: 40.15901483584781,
      lon: -73.97273342515048,
    });

    expect(set(modifiedArray.map(r => r.id))).toEqual(
      set([
        `${nodeA}#0`,
        `${wayA}#0`,
        `${wayB}#1`,
        `${trWithWayA}#0`,
        `${trWithWayB}#1`,
      ])
    );

    osmState = stateAddModified(osmState, [...modifiedArray]);

    expect(osmState.log).toMatchSnapshot();
    expect(osmState.modified).toMatchSnapshot();

    expect(relevantVisibleKeys(osmState, ['321'])).toEqual(
      set([
        `${relationBWithBuildingB}#0`,
        `${nodeB}#0`,
        `${nodeA}#0`,
        `${trWithWayB}#1`,
        `${trWithWayA}#0`,
        `${buildingBWithNodeB}#0`,
        `${wayB}#1`,
        `${wayA}#0`,
        `${wayC}#0`,
      ])
    );
  });

  it('move nodeB', () => {
    const modifiedArray = nodeMove(osmState, nodeB, {
      lat: 40.75902241791539,
      lon: -73.9724320178147,
    });

    expect(set(modifiedArray.map(r => r.id))).toEqual(
      set([
        `${nodeB}#1`,
        `${buildingBWithNodeB}#1`,
        `${wayC}#1`,
        `${wayB}#2`,
        `${relationBWithBuildingB}#1`,
        `${trWithWayB}#2`,
      ])
    );

    osmState = stateAddModified(osmState, [...modifiedArray]);

    expect(osmState.modified).toMatchSnapshot();
    expect(osmState.log).toMatchSnapshot();

    expect(relevantVisibleKeys(osmState, ['321'])).toMatchSnapshot();

    expect(relevantVisibles(osmState, ['321'])).toMatchSnapshot();
  });
});

describe('reintroduce entities when initially only wayB exists and is modified', () => {
  const allEntities = parseFixture('four.xml');

  const wayBEntity = allEntities.find(r => r.id === wayB) as Way;
  const testNode = nodeFactory({ id: 'n-1' });
  const initialEntities = [
    wayBEntity,
    testNode,
    ...allEntities.filter(en => wayBEntity.nodes.indexOf(en.id) > -1),
  ];

  let osmState = stateCreate();
  osmState = stateAddVirgins(osmState, initialEntities, '321');
  relevantVisibleKeys(osmState, ['321']);

  it('wayB & nodeB should be added', () => {
    expect(osmState.virgin.elements.get(wayB)).toEqual(wayBEntity);
    expect(osmState.virgin.elements.get(nodeB)).toBeTruthy();
    expect(osmState.modified.get(wayB)).toEqual(undefined);
    expect(osmState.modified.get(nodeB)).toEqual(undefined);
  });

  it('modify nodeB', () => {
    const modifiedArray = nodeMove(osmState, nodeB, {
      lat: 40.75902241791539,
      lon: -73.9724320178147,
    });
    osmState = stateAddModified(osmState, [...modifiedArray]);

    expect(set(modifiedArray.map(r => r.id))).toEqual(
      set([`${nodeB}#0`, `${wayB}#0`])
    );
  });

  it('add new virgin entities', () => {
    const otherVirginEntities = allEntities.filter(r => r.id !== wayB);
    osmState = stateAddVirgins(osmState, otherVirginEntities, '322');

    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${wayB}#0`);
    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${nodeB}#0`);
  });

  it('does not render testNode in other quadkeys', () => {
    expect(stateGetVisibles(osmState, ['322']).has(testNode.id)).toBe(false);
    expect(stateGetVisibles(osmState, ['321']).has(testNode.id)).toBe(true);
  });

  it('should modify buildingBWithNodeB', () => {
    expect(relevantVisibleKeys(osmState, ['322'])).toContain(
      `${buildingBWithNodeB}#0`
    );
  });

  it('shouldnt touch wayA', () => {
    expect(osmState.modified.has(wayA)).toBe(false);
  });

  it('should add  wayC properly', () => {
    const modifiedWayC = osmState.modified.get(`${wayC}#0`) as Way;
    const origWayC = osmState.modified.get(wayC) as Way;

    expect(modifiedWayC.nodes).toContain(`${nodeB}#0`);
    expect(modifiedWayC.nodes).not.toContain(nodeB);
    expect(modifiedWayC).toMatchSnapshot();

    // expect(
    //   modifiedWayC.nodes.every(r => osmState.modified.get(r) != null)
    // ).toEqual(true);

    expect(
      modifiedWayC.nodes.map(r => osmState.modified.get(r))
    ).toMatchSnapshot();
  });
});

describe('reintroduce entities when initially only wayA & wayC exist and nodeA & nodeB are modified', () => {
  const allEntities = parseFixture('four.xml');

  const wayAEntity = allEntities.find(r => r.id === wayA) as Way;
  const wayCEntity = allEntities.find(r => r.id === wayC) as Way;

  const initialEntities = [
    wayAEntity,
    wayCEntity,
    ...allEntities.filter(
      en =>
        wayAEntity.nodes.indexOf(en.id) > -1 ||
        wayCEntity.nodes.indexOf(en.id) > -1
    ),
  ];

  let osmState = stateCreate();
  osmState = stateAddVirgins(osmState, initialEntities, '321');
  relevantVisibleKeys(osmState, ['321']);

  it('modify nodeA ', () => {
    const modifiedArray = nodeMove(osmState, nodeA, {
      lat: 40.75902241791539,
      lon: -73.9724320178147,
    });
    osmState = stateAddModified(osmState, [...modifiedArray]);

    expect(set(modifiedArray.map(r => r.id))).toEqual(
      set([`${nodeA}#0`, `${wayA}#0`])
    );

    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${wayA}#0`);
    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${nodeA}#0`);
  });

  it('modify nodeB ', () => {
    const modifiedArray = nodeMove(osmState, nodeB, {
      lat: 40.72902241791539,
      lon: -73.9714320178147,
    });
    osmState = stateAddModified(osmState, [...modifiedArray]);

    expect(set(modifiedArray.map(r => r.id))).toEqual(
      set([`${wayC}#0`, `${nodeB}#0`])
    );

    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${wayA}#0`);
    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${nodeA}#0`);
    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${wayC}#0`);
    expect(relevantVisibleKeys(osmState, ['322'])).toContain(`${nodeB}#0`);
  });

  it('introduce wayB and related', () => {
    const wayBEntity = allEntities.find(r => r.id === wayB) as Way;
    const wayBAndFamily = [
      wayBEntity,
      ...allEntities.filter(en => wayBEntity.nodes.indexOf(en.id) > -1),
    ];

    osmState = stateAddVirgins(osmState, wayBAndFamily, '323');

    const modifiedWayB = osmState.modified.get(`${wayB}#1`) as Way;

    expect(modifiedWayB.nodes).toContain(`${nodeA}#0`);
    expect(modifiedWayB.nodes).toContain(`${nodeB}#0`);
    // expect(relevantVisibleKeys(osmState, ['32'])).toEqual(
    //   set([`${wayB}#1`, `${wayC}#0`, `${wayA}#0`, `${nodeA}#0`])
    // );
  });
});
