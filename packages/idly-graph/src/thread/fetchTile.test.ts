import { miniXML3 } from '../worker/parsing/fixtures';
import { fetchTile } from './fetchTile';

declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('fetchTile', () => {
  test('gives an xml', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          async text(): Promise<any> {
            return miniXML3;
          },
          ok: true,
        });
      });
    });
    const xml = await fetchTile(17, 17, 18);
    expect(xml).toMatchSnapshot();
  });
  test('should fail if status > 400', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          id: '123',
          ok: false,
          statusText: 'errored',
          async text(): Promise<any> {
            return miniXML3;
          },
        });
      });
    });
    expect.assertions(1);
    fetchTile(17, 17, 18).catch(e => expect(e.message).toEqual('errored'));
  });
});
