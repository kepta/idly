import { entityToFeature } from './entityToFeatures';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

test('works with an empty array', async () => {
  const x = entityToFeature([]);
  expect(x([])).toHaveLength(0);
});
