import { compareTags } from '../compareEntities/compareTags';
import { attributesFactory } from '../entityFactory/attributesFactory';

test('tags', () => {
  expect(compareTags({ a: 'a', b: 'a' }, { b: 'a', a: 'a' })).toBe(true);
  expect(compareTags({ a: 'a', b: 'a' }, { b: 'a', a: 'b' })).toBe(false);
  expect(compareTags({ a: 'a', b: 'false' }, { b: 'false', a: 'a' })).toBe(
    true
  );
  expect(
    compareTags({ a: 'a', b: 'false' }, { b: 'false', a: 'a', c: 'c' })
  ).toBe(false);

  expect(compareTags({ a: 'a', b: 'false' }, {})).toBe(false);
  const sameInstance = { a: 'a', b: 'false' };
  expect(compareTags(sameInstance, sameInstance)).toBe(true);

  expect(
    compareTags(
      attributesFactory({ visible: true }),
      attributesFactory({ visible: true })
    )
  ).toBe(true);
});
