// tslint:disable no-expression-statement

import { genLngLat } from '../../../osm/genLngLat';
import { createNode } from './createEntity';

// tslint:disable:object-literal-sort-keys

describe('create simple node', () => {
  test('simple test', () => {
    const n = createNode({ id: 'n1' });
    expect(n).toMatchSnapshot();
  });
  test('works with empty tags', () => {
    const n = createNode({ id: 'n1', tags: {} });
    expect(n.tags).toEqual({});
    const n2 = createNode({ id: 'n1' });
    expect(n2.tags).toEqual({});
  });
  test('simple test node with tags', () => {
    const n = createNode({ id: 'n1', tags: { k: 'na' } });
    expect(n).toMatchSnapshot();
  });
  test('works with full blown object', () => {
    const n = createNode({
      id: 'n-a',
      loc: genLngLat([1, 2]),
      tags: { k: 'n-a4' },
      type: 'node',
    });
    expect(n).toMatchSnapshot();
  });
  test('different order of keys produce same output', () => {
    const n1 = createNode({
      loc: genLngLat([1, 2]),
      id: 'n-a',
      type: 'node',
      tags: { k: 'n-a4' },
    });
    const n2 = createNode({
      id: 'n-a',
      loc: genLngLat([1, 2]),
      tags: { k: 'n-a4' },
      type: 'node',
    });
    expect(n2).toEqual(n1);
  });
  test('tags get sorted', () => {
    const n = createNode({ id: 'n1', tags: { k: 'na', a: 'b' } });
    expect(Object.keys(n.tags)).toEqual(['a', 'k']);
  });

  test('works with attributes', () => {
    const n = createNode({ id: 'n1' });
    expect(n.attributes).toEqual({
      changeset: undefined,
      timestamp: undefined,
      uid: undefined,
      user: undefined,
      version: undefined,
      visible: undefined,
    });
  });
  test('works with attributes 2', () => {
    const n = createNode({
      attributes: { visible: false, timestamp: '1' },
      id: 'n1',
    });
    const n2 = createNode({
      id: 'n1',
      attributes: { visible: false, timestamp: '2' },
    });
    expect(n.attributes).not.toEqual(n2.attributes);
  });
  test('works with attributes with differnt key order', () => {
    const n = createNode({
      attributes: { visible: false, timestamp: '1', uid: '1' },
      id: 'n1',
    });
    expect(Object.keys(n.attributes)).toEqual([
      'changeset',
      'timestamp',
      'uid',
      'user',
      'version',
      'visible',
    ]);
  });

  test('reuses already existing instance', () => {
    const n1 = createNode({ id: 'n1', tags: { k: 'na', a: 'b' } });
    const n2 = createNode({ id: 'n1', tags: { k: 'na', a: 'b' } });
    expect(n1).toBe(n2);
  });

  test('reuses already existing instance with reordered keys', () => {
    const n1 = createNode({
      tags: { k: 'na', a: 'b' },
      id: 'n1',
    });
    const n2 = createNode({ id: 'n1', tags: { k: 'na', a: 'b' } });
    expect(n1).toBe(n2);
  });

  test('reuses already existing instance when lngLat', () => {
    const n1 = createNode({
      loc: genLngLat([1, 2]),
      tags: { k: 'na', a: 'b' },
      id: 'n1',
    });
    const n2 = createNode({
      id: 'n1',
      loc: genLngLat([1, 2]),
      tags: { k: 'na', a: 'b' },
    });

    expect(n1).toBe(n2);

    const n3 = createNode({
      loc: genLngLat([1, 2]),
      id: 'n1',
    });
    const n4 = createNode({
      id: 'n1',
      loc: genLngLat([1, 2]),
    });
    expect(n3).toBe(n4);
  });
});
