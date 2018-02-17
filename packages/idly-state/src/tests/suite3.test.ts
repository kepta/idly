import {
  osmStateAddVirgins,
  osmStateCreate,
  osmStateGetVisible,
} from '../osmState';
import { parseFixture } from './helpers';

const mapToKeys = <T>(map: Map<string, T> | ReadonlyMap<string, T>) => [
  ...map.keys(),
];

describe('from xml to final rendering', () => {
  const virginEntities = parseFixture('three.xml');

  const osmState = osmStateCreate();

  osmStateAddVirgins(osmState, virginEntities, '3');

  let visible1;

  it('get visible', () => {
    visible1 = osmStateGetVisible(osmState, ['3']);
    expect(mapToKeys(visible1)).toMatchSnapshot();
    expect(
      [...visible1].map(([k, o]) => ['parentRelations', k, o.parentRelations])
    ).toMatchSnapshot();
    expect(
      [...visible1].map(([k, o]) => ['parentWays', k, o.parentWays])
    ).toMatchSnapshot();
    expect(
      [...visible1].map(([k, o]) => [k, JSON.stringify(o.entity)])
    ).toMatchSnapshot();
  });
});
