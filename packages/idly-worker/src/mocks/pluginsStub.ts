import { EntityTable } from 'idly-common/lib/osm/immutableStructures';

export function pluginsStub(
  geometry: any = {
    'osm_basic--geometry': 'line',
  }
): Promise<any> {
  return Promise.resolve({
    workers: [
      {
        pluginName: 'dummy',
        worker: (entityTable: EntityTable) => {
          const m = new Map();
          entityTable.forEach((_, k) => {
            m.set(k, geometry);
          });
          return m;
        },
      },
    ],
  });
}
