import { entityTableGen } from 'idly-common/lib/osm/entityTableGen';
import { pluginsStub } from '../misc/pluginsStub';
import { entityToFeature } from './entityToFeatures';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

test('works with an empty array', async () => {
  const x = entityToFeature(
    (await pluginsStub()).workers.map((r: any) => r.worker),
  );

  expect(x(entityTableGen([]))).toHaveLength(0);
});
