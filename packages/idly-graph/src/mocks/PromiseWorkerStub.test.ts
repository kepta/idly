import { PromiseWorkerStub } from './PromiseWorkerStub';

describe('PromiseWorkerStub', () => {
  test('postMessage calls worker once', async () => {
    const promiseWorker = new PromiseWorkerStub();
    const mockCallback = jest.fn();
    promiseWorker.registerPromiseWorker(mockCallback);
    await promiseWorker.postMessage({ type: 'hi', request: 'hi' });
    expect(mockCallback.mock.calls.length).toBe(1);
  });
  test('postMessage calls default function in worker when no match', async () => {
    const promiseWorker = new PromiseWorkerStub();
    const mockFetchMap = jest.fn();
    const mockFetchEntities = jest.fn();
    const mockDefault = jest.fn();
    function controller(message: any): Promise<string> {
      switch (message.type) {
        case 'fetchmap':
          return mockFetchMap(message);
        case 'fetchEntities':
          return mockFetchEntities(message);
        default: {
          return mockDefault(message);
        }
      }
    }
    promiseWorker.registerPromiseWorker(controller);
    await promiseWorker.postMessage({ type: 'hi', request: 'hi' });
    expect(mockDefault.mock.calls.length).toBe(1);
    expect(mockFetchEntities.mock.calls.length).toBe(0);
    expect(mockFetchMap.mock.calls.length).toBe(0);
  });

  test('postMessage calls fetchmap function in worker when match', async () => {
    const promiseWorker = new PromiseWorkerStub();
    const mockFetchMap = jest.fn();
    const mockFetchEntities = jest.fn();
    const mockDefault = jest.fn();
    function controller(m: any): Promise<string> {
      switch (m.type) {
        case 'fetchmap':
          return mockFetchMap(m);
        case 'fetchEntities':
          return mockFetchEntities(m);
        default: {
          return mockDefault(m);
        }
      }
    }
    promiseWorker.registerPromiseWorker(controller);
    const message = { type: 'fetchmap', request: 'hi' };
    await promiseWorker.postMessage(message);
    expect(mockFetchMap.mock.calls[0][0]).not.toBe(message);
    expect(mockFetchMap.mock.calls[0][0]).toEqual(message);
  });

  test('postMessage returns value correctly', async () => {
    const promiseWorker = new PromiseWorkerStub();
    const mockFetchMap = jest.fn();
    const mockFetchEntities = jest.fn();
    const mockDefault = jest.fn();
    const response = {
      data: [1, 2],
      load: {
        a: 'b',
      },
    };
    function controller(m: any): Promise<string> {
      switch (m.type) {
        case 'fetchmap':
          return mockFetchMap(m);
        case 'fetchEntities':
          return Promise.resolve(JSON.stringify(response));
        default: {
          return mockDefault(m);
        }
      }
    }
    promiseWorker.registerPromiseWorker(controller);
    const message = { type: 'fetchEntities', request: 'hi' };
    const resp = JSON.parse(await promiseWorker.postMessage(message));
    expect(resp).toEqual(response);
  });
});
