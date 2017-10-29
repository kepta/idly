import { BBox } from '@turf/helpers';
import { XML3, XML4 } from '../misc/fixtures';
import { pluginsStub } from '../misc/pluginsStub';
import { PromiseWorkerStub } from '../misc/PromiseWorkerStub';
import { getMap } from './getMap';
import { operations } from './operations';
import { setOsmTiles } from './setOsmTiles';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('fetchMap: custom controller', () => {
  const req = {
    bbox: [
      -73.98630242339283,
      40.73537277780156,
      -73.98264244865518,
      40.73941515574535,
    ] as BBox,
    zoom: 17.54,
  };
  test('small xml test', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(XML3);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());

    promiseWorker.registerPromiseWorker(controller);
    // TOFIX use a static state
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const bindedFetchMap = getMap(promiseWorker);
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

  test('filtering of hidden entities', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(XML3);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());

    promiseWorker.registerPromiseWorker(controller);
    // TOFIX use a static state
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const bindedFetchMap = getMap(promiseWorker);

    const resp = await bindedFetchMap({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      hiddenIds: ['w2', 'n1', 'n2'],
      zoom: 17.54,
    });
    expect(resp.features.map(r => r.id)).toEqual(['n3', 'w1']);
  });
  test('big xml test', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          text(): Promise<any> {
            return Promise.resolve(XML4);
          },
          ok: true,
        });
      });
    });
    const promiseWorker = new PromiseWorkerStub();
    const controller = operations(pluginsStub());

    promiseWorker.registerPromiseWorker(controller);
    // TOFIX use a static state
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const bindedFetchMap = getMap(promiseWorker);
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
