import { pluginsStub } from '../misc/pluginsStub';
import { PromiseWorkerStub } from '../misc/PromiseWorkerStub';
import { miniXML3, stubXML } from '../worker/parsing/fixtures';
import { Manager } from '../worker/store/manager';
import { fetchMap, workerFetchMap } from './fetchMap';
import { operations } from './operations';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('fetchMap: custom controller', () => {
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
    const manager = new Manager(pluginsStub());
    const controller = (message: any) =>
      workerFetchMap(manager)(message.request);
    promiseWorker.registerPromiseWorker(controller);
    const bindedFetchMap = fetchMap(promiseWorker);
    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    expect(resp).toMatchSnapshot();
  });

  test.skip('big xml test', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(stubXML);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const manager = new Manager(pluginsStub());
    const controller = (message: any) =>
      workerFetchMap(manager)(message.request);
    promiseWorker.registerPromiseWorker(controller);
    const bindedFetchMap = fetchMap(promiseWorker);
    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    expect(resp).toMatchSnapshot();
  });
});

describe('fetchMap integration test', () => {
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
    const bindedFetchMap = fetchMap(promiseWorker);
    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    expect(resp).toMatchSnapshot();
  });
});
