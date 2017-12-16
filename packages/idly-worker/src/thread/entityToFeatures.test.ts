import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { pluginsStub } from '../mocks/pluginsStub';
import { entityToFeature } from './entityToFeatures';

test('works with an empty array', async () => {
  const x = entityToFeature(
    (await pluginsStub()).workers.map((r: any) => r.worker),
  );

  expect(x(entityTableGen([]))).toHaveLength(0);
});
