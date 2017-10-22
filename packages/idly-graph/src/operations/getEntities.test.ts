import { miniXML3 } from '../misc/fixtures';
import { pluginsStub } from '../misc/pluginsStub';
import { PromiseWorkerStub } from '../misc/PromiseWorkerStub';

import { getEntities } from './getEntities';
import { operations } from './operations';
import { setOsmTiles } from './setOsmTiles';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('getEntities', () => {
  test('small xml test', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(miniXML3);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());
    promiseWorker.registerPromiseWorker(controller);
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const resp1 = getEntities(promiseWorker)({ entityIds: ['n1'] });
    const resp2 = getEntities(promiseWorker)({
      entityIds: ['n2', 'w1'],
    });
    expect(await resp1).toMatchSnapshot();
    expect(await resp2).toMatchSnapshot();
  });
});
