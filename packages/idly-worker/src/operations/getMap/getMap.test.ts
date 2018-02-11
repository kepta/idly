import { BIG_XML1, XML3 } from '../../misc/fixtures';
import { stubWorkerLogic } from '../../mocks/PromiseWorkerStub';
import { xmlFetchMock } from '../../mocks/xmlFetchMock';
// import { setOsmTiles } from '../setOsmTiles/main';
import { getQuadkey } from '../getQuadkeys/main';
import { parser } from 'idly-faster-osm-parser';

declare var global: any;

describe('fetchMap: custom controller', () => {
  // global.fetch = xmlFetchMock(XML3);
  test('small xml test', async () => {
    const promiseWorker = stubWorkerLogic();
    const entities = parser(XML3);
    const resp = await getQuadkey(promiseWorker)([
      {
        entities,
        quadkey: '123',
      },
    ]);
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
  test.only('big xml test', async () => {
    const promiseWorker = stubWorkerLogic();
    const entities = parser(BIG_XML1);
    const resp = await getQuadkey(promiseWorker)([
      {
        entities,
        quadkey: '123',
      },
    ]);

    expect(resp.features.length).toBe(1441);
    expect(resp.features.map(f => f.properties)).toMatchSnapshot();
  });
});
