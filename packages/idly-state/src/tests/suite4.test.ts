import { Table } from '../dataStructures/table';
import { nodeMove } from '../editing/nodeMove';
import {
  stateAddChanged,
  stateAddVirgins,
  stateCreate,
  stateGetVisibles,
} from '../index';
import { expectStable } from './expectStable';
import { parseFixture } from './helpers';

const nodeA = 'n596775900';
const nodeB = 'n42436703';
const wayA = 'w497165753';
const wayB = 'w458180192';
const wayC = 'w497165756';

const relevantEntities = [nodeA, nodeB, wayA, wayB, wayC];
const getRelevantEntities = <T>(t: Table<T>) => {
  const newMap = new Map();
  t.forEach((e, k) => {
    if (relevantEntities.some(rel => k === rel || k.startsWith(rel))) {
      newMap.set(k, e);
    }
  });
  return newMap;
};

describe('from xml to final rendering', () => {
  const virginEntities = parseFixture('four.xml');

  let osmState = stateCreate();

  stateAddVirgins(osmState, virginEntities, '3');

  it('get visible ', () => {
    expectStable([
      ...getRelevantEntities(stateGetVisibles(osmState, ['3'])).keys(),
    ]).toMatchSnapshot();
  });

  it('move nodeB ', () => {
    const modifiedArray = nodeMove(osmState, nodeB, {
      lat: 40.75902241791539,
      lon: -73.9724320178147,
    });
    expect(modifiedArray.map(r => r.id)).toEqual([
      `${nodeB}#0`,
      `w109287832#0`,
      `${wayB}#0`,
      `${wayC}#0`,
      `r5594260#0`,
      `r6247413#0`,
    ]);
    osmState = stateAddChanged(osmState, [...modifiedArray]);

    expect(osmState.modified).toMatchSnapshot();
    expect(osmState.log).toMatchSnapshot();

    expect([
      ...getRelevantEntities(stateGetVisibles(osmState, ['3'])).keys(),
    ]).toMatchSnapshot();

    expectStable(
      getRelevantEntities(stateGetVisibles(osmState, ['3']))
    ).toMatchSnapshot();
  });

  it('move nodeA', () => {
    const modifiedArray = nodeMove(osmState, nodeA, {
      lat: 40.15901483584781,
      lon: -73.97273342515048,
    });
    expect(modifiedArray.map(r => r.id)).toEqual([
      `${nodeA}#0`,
      `${wayA}#0`,
      `${wayB}#1`,
      'r7297408#0',
      'r6247413#1',
    ]);
    osmState = stateAddChanged(osmState, [...modifiedArray]);

    expect(osmState.log).toMatchSnapshot();
    expect(osmState.modified).toMatchSnapshot();

    expect([
      ...getRelevantEntities(stateGetVisibles(osmState, ['3'])).keys(),
    ]).toEqual([
      `${nodeA}#0`,
      `${wayA}#0`,
      `${wayB}#1`,
      `${nodeB}#0`,
      `${wayC}#0`,
    ]);
  });

  it('move nodeB', () => {
    const modifiedArray = nodeMove(osmState, nodeB, {
      lat: 40.75902241791539,
      lon: -73.9724320178147,
    });

    expect(modifiedArray.map(r => r.id).sort()).toEqual(
      [
        `${nodeB}#1`,
        `w109287832#1`,
        `${wayB}#2`,
        `${wayC}#1`,
        `r5594260#1`,
        `r6247413#2`,
      ].sort()
    );
    osmState = stateAddChanged(osmState, [...modifiedArray]);

    expect(osmState.modified).toMatchSnapshot();
    expect(osmState.log).toMatchSnapshot();

    expect([
      ...getRelevantEntities(stateGetVisibles(osmState, ['3'])).keys(),
    ]).toMatchSnapshot();

    expectStable(
      getRelevantEntities(stateGetVisibles(osmState, ['3']))
    ).toMatchSnapshot();
  });
});
