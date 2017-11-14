import { attributesGen } from '../attributesGen';
import { compareNode } from '../compareNode';
import { compareShallow } from '../compareShallow';
import { genLngLat } from '../genLngLat';
import { nodeFactory } from '../nodeFactory';
test('simple 1', () => {
  const n1 = nodeFactory({ id: '1', tags: { a: 'a', b: 'a' } });
  expect(compareNode(n1, n1)).toBe(true);
});
test('simple 2', () => {
  const n1 = nodeFactory({ id: '1', tags: { a: 'a', b: 'a' } });
  const n2 = nodeFactory({ id: '1', tags: { a: 'ab', b: 'a' } });
  expect(compareNode(n1, n2)).toBe(false);
});

test('simple 3', () => {
  const n2 = nodeFactory({ id: '1', tags: { a: 'ab', b: 'a' } });
  const n3 = nodeFactory({ id: '1', tags: { a: 'ab', b: 'a', c: 'k' } });
  expect(compareNode(n3, n2)).toBe(false);
});

test('simple 4', () => {
  const n4 = nodeFactory({ id: '1', tags: { a: 'ab', b: 'a', c: 'k' } });
  const n44 = nodeFactory({ id: '1', tags: { a: 'ab', b: 'a', c: 'k' } });
  expect(compareNode(n4, n44)).toBe(true);
});

test('simple 4', () => {
  const a = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([0, 0]),
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([0, 0]),
  });
  expect(compareNode(a, b)).toBe(true);
});

test('simple 4', () => {
  const a = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([0, 1]),
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([0, 0]),
  });
  expect(compareNode(a, b)).toBe(false);
});

test('simple 4', () => {
  const a = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([1, 0]),
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([0, 0]),
  });
  expect(compareNode(a, b)).toBe(false);
});

test('simple 4', () => {
  const a = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([NaN, 0]),
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc: genLngLat([0, 0]),
  });
  expect(compareNode(a, b)).toBe(false);
});

test('simple 4', () => {
  const loc = genLngLat([0, 0]);
  const a = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc,
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc,
  });
  expect(compareNode(a, b)).toBe(true);
});

test('simple 4', () => {
  const loc = genLngLat([0, 0]);
  const a = nodeFactory({
    id: '1',
    tags: { a: 'a', b: 'a', c: 'k' },
    loc,
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc,
  });
  expect(compareNode(a, b)).toBe(false);
});

test('simple attribtuons', () => {
  const loc = genLngLat([0, 0]);
  const a = nodeFactory({
    id: '1',
    tags: { a: 'a', b: 'a', c: 'k' },
    loc,
    attributes: attributesGen({ visible: true }),
  });
  const b = nodeFactory({
    id: '1',
    tags: { a: 'ab', b: 'a', c: 'k' },
    loc,
  });
  expect(compareNode(a, b)).toBe(false);
});

test('simple attribtuons 2', () => {
  const loc = genLngLat([0, 0]);
  const a = nodeFactory({
    id: '1',
    tags: { a: 'a', b: 'a', c: 'k' },
    loc,
    attributes: attributesGen({ visible: true }),
  });

  const b = nodeFactory({
    id: '1',
    tags: { a: 'a', b: 'a', c: 'k' },
    loc,
    attributes: attributesGen({ visible: true }),
  });
  expect(compareNode(a, b)).toBe(true);
});
