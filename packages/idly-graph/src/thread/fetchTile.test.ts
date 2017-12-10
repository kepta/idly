import { XML3 } from '../misc/fixtures';
import { fetchTile } from './fetchTile';

declare var global: any;

describe.skip('fetchTile', () => {
  test('basic test', async () => {
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
    const entities = await fetchTile(17, 17, 18);
    expect(entities).toMatchSnapshot();
  });
});
