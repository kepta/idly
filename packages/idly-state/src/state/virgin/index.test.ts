import { virginAddElements, virginStateCreate } from '.';

describe('virginAddElements', () => {
  test('should not overwrite existing virgin entities', () => {
    const item1 = { id: 'n1' };
    const vState = virginStateCreate();
    virginAddElements([item1], '121', vState);

    const item1Copy = Object.assign({}, item1);

    virginAddElements([item1Copy], '121', vState);
    expect(vState.elements.get(item1.id)).toBe(item1);
  });
  test('should not overwrite existing virgin entities even if in different quadkey', () => {
    const item1 = { id: 'n1' };
    const vState = virginStateCreate();
    virginAddElements([item1], '121', vState);

    const item1Copy = Object.assign({}, item1);

    virginAddElements([item1Copy], '122', vState);
    expect(vState.elements.get(item1.id)).toBe(item1);
  });
});
