import { lngLatFactory } from '../../geo/lngLatFactory';
import { attributesFactory } from '../../osm/entityFactory/attributesFactory';
import { Attributes } from '../../osm/structures';
import {
  createEntity,
  createNode,
  createRelation,
  createWay,
} from './createEntity';

const dummyAttributes = (): Attributes =>
  attributesFactory(
    Object.keys(attributesFactory())
      .map(r => [r, 'dummy-' + r])
      .reduce((prev: any, [k, v]) => {
        prev[k] = v;
        return prev;
      }, {})
  );

describe('createEntity', () => {
  it('should create', () => {
    expect(
      createEntity({
        attributes: dummyAttributes(),
        id: 'n-1',
        loc: lngLatFactory([0, 0]),
        tags: {},
        type: 'node',
      })
    ).toMatchSnapshot();
  });
  it('should work with strings', () => {
    expect(
      createEntity(
        JSON.stringify({
          attributes: dummyAttributes(),
          id: 'n-1',
          loc: lngLatFactory([0, 0]),
          tags: {},
          type: 'node',
        })
      )
    ).toBeTruthy();
  });
  it('should throw with wrong strings', () => {
    expect(() =>
      createEntity(JSON.stringify({}))
    ).toThrowErrorMatchingSnapshot();
  });
  it('should throw with empty object', () => {
    // @ts-ignore
    expect(() => createEntity({})).toThrowErrorMatchingSnapshot();
  });
  it('should throw when only id is provided', () => {
    // @ts-ignore
    expect(() => createEntity({ id: 'n-1' })).toThrowErrorMatchingSnapshot();
  });
  it('should throw when only id & tag is provided', () => {
    // @ts-ignore
    expect(() =>
      createEntity({ id: 'n-1', type: 'node' })
    ).toThrowErrorMatchingSnapshot();
  });
  it('should throw when no id', () => {
    expect(() =>
      // @ts-ignore
      createEntity({
        attributes: dummyAttributes(),
        loc: lngLatFactory([0, 0]),
        tags: {},
        type: 'node',
      })
    ).toThrowErrorMatchingSnapshot();
  });
  it('should throw when wrong id', () => {
    expect(() =>
      createEntity({
        attributes: dummyAttributes(),
        id: 'z-1',
        loc: lngLatFactory([0, 0]),
        tags: {},
        type: 'node',
      })
    ).toThrowErrorMatchingSnapshot();
    expect(() =>
      createEntity({
        attributes: dummyAttributes(),
        id: 'r-1',
        loc: lngLatFactory([0, 0]),
        tags: {},
        type: 'node',
      })
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('createNode', () => {
  it('should create node', () => {
    expect(
      createNode({
        attributes: dummyAttributes(),
        id: 'n-1',
        loc: lngLatFactory([0, 0]),
        tags: {},
        type: 'node',
      })
    ).toMatchSnapshot();
  });
  it('should not create other entities', () => {
    expect(() =>
      createNode({
        attributes: dummyAttributes(),
        id: 'w-1',
        // @ts-ignore
        nodes: [],
        tags: {},
        type: 'way',
      })
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('createWay', () => {
  it('should create way', () => {
    expect(
      createWay({
        attributes: dummyAttributes(),
        id: 'w-1',
        nodes: [],
        tags: {},
        type: 'way',
      })
    ).toMatchSnapshot();
  });
  it('should check for valid nodes', () => {
    expect(
      createWay({
        attributes: dummyAttributes(),
        id: 'w-1',
        nodes: ['n-1'],
        tags: {},
        type: 'way',
      })
    ).toMatchSnapshot();
  });
  it('should throw for invalid nodes', () => {
    expect(() =>
      createWay({
        attributes: dummyAttributes(),
        id: 'w-1',
        nodes: ['r-1'],
        tags: {},
        type: 'way',
      })
    ).toThrowErrorMatchingSnapshot();
  });
  it('should not create other entities', () => {
    expect(() =>
      createWay({
        attributes: dummyAttributes(),
        id: 'n-1',
        // @ts-ignore
        loc: lngLatFactory([0, 0]),
        tags: {},
        type: 'node',
      })
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('createRelation', () => {
  it('should create relation', () => {
    expect(
      createRelation({
        attributes: dummyAttributes(),
        id: 'r-1',
        members: [
          {
            id: 'n-1',
          },
        ],
        tags: {},
        type: 'relation',
      })
    ).toMatchSnapshot();
  });
  it('should not create other entities', () => {
    expect(() =>
      createRelation({
        attributes: dummyAttributes(),
        id: 'w-1',
        // @ts-ignore
        nodes: [],
        tags: {},
        type: 'way',
      })
    ).toThrowErrorMatchingSnapshot();
  });
  it('should throw wrong members', () => {
    expect(() =>
      createRelation({
        attributes: dummyAttributes(),
        id: 'r-1',
        members: [
          {
            // @ts-ignore
            zebra: 'cross',
          },
        ] as any,
        tags: {},
        type: 'relation',
      })
    ).toThrowErrorMatchingSnapshot();
  });
});
