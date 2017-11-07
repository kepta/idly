export function xmlFetchMock(xml: string, id = '123'): any {
  return jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) =>
      resolve({
        id,
        text(): Promise<any> {
          return Promise.resolve(xml);
        },
        ok: true,
      }),
    );
  });
}
