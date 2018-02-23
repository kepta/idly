import area from './';
describe('area layers snapshot', () => {
  const layerIds = area.map(r => r.layer.id);

  it('check the structure', () => {
    expect(area).toHaveLength(22);
    expect(area.map(r => r.layer.id)).toMatchSnapshot();
  });

  for (const layer of layerIds) {
    it('checks layer', () => {
      expect(area.find(r => r.layer.id === layer)).toMatchSnapshot();
    });
  }
});
