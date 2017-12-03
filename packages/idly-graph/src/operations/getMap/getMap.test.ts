import { BBox } from '@turf/helpers';
import { XML3, XML4 } from '../../misc/fixtures';
import {
  PromiseWorkerStub,
  stubWorkerLogic,
} from '../../mocks/PromiseWorkerStub';
import { xmlFetchMock } from '../../mocks/xmlFetchMock';
import { getMap } from './main';
import { operations } from '../operations';
import { setOsmTiles } from '../setOsmTiles/main';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('fetchMap: custom controller', () => {
  global.fetch = xmlFetchMock(XML3);
  test('small xml test', async () => {
    const promiseWorker = stubWorkerLogic();
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
    const promiseWorker = stubWorkerLogic();
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
    global.fetch = xmlFetchMock(XML4);
    const promiseWorker = stubWorkerLogic();

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
    // console.log(resp.features.length);
    expect(resp.features.length).toBe(1441);
    expect(resp.features.map(f => f.properties)).toMatchSnapshot();
  });
});
