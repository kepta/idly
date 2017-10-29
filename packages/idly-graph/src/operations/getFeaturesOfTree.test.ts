import { XML3 } from '../misc/fixtures';
import { pluginsStub } from '../misc/pluginsStub';
import { PromiseWorkerStub } from '../misc/PromiseWorkerStub';
import { getEntities } from './getEntities';
import { getFeaturesOfTree } from './getFeaturesOfTree';
import { operations } from './operations';
import { setOsmTiles } from './setOsmTiles';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('getFeaturesOfTree', () => {
  global.fetch = jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      resolve({
        id: '123',
        async text(): Promise<any> {
          return XML3;
        },
        ok: true,
      });
    });
  });
  const promiseWorker = new PromiseWorkerStub();
  const controller = operations(pluginsStub());
  promiseWorker.registerPromiseWorker(controller);

  test('small xml test', async () => {
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const tree = await getEntities(promiseWorker)({ entityIds: ['n1'] });
    const resp1 = getFeaturesOfTree(promiseWorker)({
      treeString: JSON.stringify(tree.toJs()),
    });
    expect(await resp1).toMatchSnapshot();
  });
});
