import { EntityTable } from 'idly-common/lib/osm/structures';

export function pluginsStub(
  geometry: any = {
    'osm_basic--geometry': 'line',
  },
): Promise<any> {
  return Promise.resolve({
    workers: [
      {
        pluginName: 'dummy',
        // tslint:disable no-expression-statement
        worker: (entityTable: EntityTable) => {
          const m = new Map();
          entityTable.forEach((v, k) => {
            m.set(k, geometry);
          });
          return m;
        },
      },
    ],
  });
}
