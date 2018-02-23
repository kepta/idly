import highway from './';
describe('highway layers snapshot', () => {
  const layerIds = highway.map(r => r.layer.id);

  it('check the structure', () => {
    expect(highway).toHaveLength(19);
    expect(highway.map(r => r.layer.id)).toMatchSnapshot();
  });

  for (const layer of layerIds) {
    it('checks layer', () => {
      expect(highway.find(r => r.layer.id === layer)).toMatchSnapshot();
    });
  }
});
