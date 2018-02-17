import * as fs from 'fs';
import { EntityType } from 'idly-common/lib/osm/structures';
import { _internalCache, entityToGeoJson } from './';
import { Derived } from './entityToGeojson';
const parse = (file: string) =>
  new Map<string, Derived>(
    JSON.parse(fs.readFileSync('./fixture/' + file, 'utf-8'))
  );

describe('derived table to geojson end to end', () => {
  const derived1 = parse('derived1.json');
  const derived2 = parse('derived2.json');
  const derived3 = parse('derived3.json');

  it('should match geometry', () => {
    expect(
      entityToGeoJson(derived1).map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();
    expect(
      entityToGeoJson(derived2).map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();
    expect(
      entityToGeoJson(derived3).map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();
  });

  it('should match properties', () => {
    expect(entityToGeoJson(derived1).map(r => r.properties)).toMatchSnapshot();
    expect(entityToGeoJson(derived2).map(r => r.properties)).toMatchSnapshot();
    expect(entityToGeoJson(derived3).map(r => r.properties)).toMatchSnapshot();
  });
});

describe('caches entities which remain same', () => {
  const derived1 = parse('derived1.json');

  const derived2 = parse('derived2.json');

  const similarIn1And2: any[] = [];

  derived2.forEach((_, k) => {
    const val = derived1.get(k);
    if (val && val.entity.type !== EntityType.RELATION) {
      similarIn1And2.push(val);
      derived2.set(k, val);
    }
  });
  entityToGeoJson(derived1);
  entityToGeoJson(derived2);
  expect(
    similarIn1And2.filter(obj => _internalCache.has(obj)).map(r => r.entity.id)
  ).toEqual(similarIn1And2.map(r => r.entity.id));
});
