import * as fs from 'fs';
import { reviver } from 'idly-common/lib/misc/parsing';
import { EntityType } from 'idly-common/lib/osm/structures';
import * as path from 'path';
import { _internalCache, entityToGeoJson } from '../index';

const parse = (file: string) =>
  JSON.parse(
    fs.readFileSync(path.join(__dirname, 'fixture', file), 'utf-8'),
    reviver
  );

describe('derived table to geojson end to end', () => {
  const derived1 = parse('one.xml.json');
  const derived2 = parse('two.xml.json');
  const derived3 = parse('three.xml.json');
  const derived4 = parse('four.xml.json');

  it('should match geometry', () => {
    expect(entityToGeoJson(derived1).length).toBe(121);
    expect(entityToGeoJson(derived2).length).toBe(167);
    expect(entityToGeoJson(derived3).length).toBe(149);
    expect(entityToGeoJson(derived4).length).toBe(71);
    fs.writeFileSync(
      'f.json',
      JSON.stringify({
        features: entityToGeoJson(derived1),
        type: 'FeatureCollection',
      }),
      'utf-8'
    );

    expect(
      entityToGeoJson(derived1)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();

    expect(
      entityToGeoJson(derived2)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();

    expect(
      entityToGeoJson(derived3)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();

    expect(
      entityToGeoJson(derived4)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => JSON.stringify(r.geometry))
    ).toMatchSnapshot();
  });

  it('should match properties', () => {
    expect(
      entityToGeoJson(derived1)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => r.properties)
    ).toMatchSnapshot();
    expect(
      entityToGeoJson(derived2)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => r.properties)
    ).toMatchSnapshot();
    expect(
      entityToGeoJson(derived3)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => r.properties)
    ).toMatchSnapshot();
    expect(
      entityToGeoJson(derived4)
        .sort((a, b) => (a.id as any).localeCompare(b.id as any))
        .map(r => r.properties)
    ).toMatchSnapshot();
  });
});

describe('caches entities which remain same', () => {
  const derived1 = parse('one.xml.json');
  const derived2 = parse('two.xml.json');

  const similarIn1And2: any[] = [];

  derived2.forEach((_: any, k: any) => {
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
