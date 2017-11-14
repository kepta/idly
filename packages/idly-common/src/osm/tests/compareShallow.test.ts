import { attributesGen } from '../attributesGen';
import { compareShallow } from '../compareShallow';

test('tags', () => {
  expect(compareShallow({ a: 'a', b: 'a' }, { b: 'a', a: 'a' })).toBe(true);
  expect(compareShallow({ a: 'a', b: 'a' }, { b: 'a', a: 'b' })).toBe(false);
  expect(compareShallow({ a: 'a', b: 'false' }, { b: 'false', a: 'a' })).toBe(
    true,
  );
  expect(
    compareShallow({ a: 'a', b: 'false' }, { b: 'false', a: 'a', c: 'c' }),
  ).toBe(false);

  expect(compareShallow({ a: 'a', b: 'false' }, {})).toBe(false);
  const sameInstance = { a: 'a', b: 'false' };
  expect(compareShallow(sameInstance, sameInstance)).toBe(true);

  expect(
    compareShallow(
      attributesGen({ visible: true }),
      attributesGen({ visible: true }),
    ),
  ).toBe(true);
});
