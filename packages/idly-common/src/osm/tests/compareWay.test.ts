import { compareWay } from '../compareWay';
import { wayFactory } from '../wayFactory';

test('simple 2', () => {
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['0', '1']
  });
  const w2 = wayFactory({ id: '1', tags: { a: 'ab', b: 'a' } });
  expect(compareWay(w1, w2)).toBe(false);
});

test('simple 2', () => {
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['0', '1']
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['0', '1']
  });
  expect(compareWay(w1, w2)).toBe(true);
});

test('simple 2', () => {
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: []
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: []
  });
  expect(compareWay(w1, w2)).toBe(true);
});

test('simple 2', () => {
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: []
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['a']
  });
  expect(compareWay(w1, w2)).toBe(false);
});

test('simple 2', () => {
  const arr = ['a', 'b', 'c'];
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: arr
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: arr
  });
  expect(compareWay(w1, w2)).toBe(true);
});

test('simple 2', () => {
  const arr = ['a', 'b', 'c'];
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: arr
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['c', 'b', 'a']
  });
  expect(compareWay(w1, w2)).toBe(false);
});

test('simple 3', () => {
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['0', '1']
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: ['1', '0']
  });
  expect(compareWay(w1, w2)).toBe(false);
});

test('simple 2', () => {
  const arr = ['a', 'b', 'c'];
  const w1 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'a' },
    nodes: arr
  });
  const w2 = wayFactory({
    id: '1',
    tags: { a: 'a', b: 'aa' },
    nodes: arr
  });
  expect(compareWay(w1, w2)).toBe(false);
});
