import { XML3 } from '../misc/fixtures';
import { fetchTileXml } from './fetchTileXml';

declare var global: any;

describe('fetchTileXml', () => {
  test('gives an xml', async () => {
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
    const xml = await fetchTileXml(17, 17, 18);
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
            return XML3;
          },
        });
      });
    });
    expect.assertions(1);
    fetchTileXml(17, 17, 18).catch(e => expect(e.message).toEqual('errored'));
  });
});
