import equal from 'lodash-es/isEqual';

import { iDParser } from '../iDParser';
import { parser } from '../parser';
import {
  BIG_XML1,
  BIG_XML3,
  XML1,
  XML2,
  XML5,
  XML7,
  XML8,
  XML9,
} from './fixtures';

describe('smart parser', () => {
  test('case 1', () => {
    const xml = new DOMParser().parseFromString(XML2, 'text/xml');
    const en = parser(XML2);
    const entities = iDParser(xml).sort((a, b) => a.id.localeCompare(b.id));
    expect(en).toEqual(entities);
  });
  test('case 2', () => {
    const xml = new DOMParser().parseFromString(XML1, 'text/xml');
    const entities = iDParser(xml).sort((a, b) => a.id.localeCompare(b.id));
    const en = parser(XML1).sort((a, b) => a.id.localeCompare(b.id));
    expect(en).toEqual(entities);
  });
  test('case 3', () => {
    const rawXML = XML5.split('\n')
      .slice(1)
      .join('\n');
    const xml = new DOMParser().parseFromString(rawXML, 'text/xml');
    const entities = iDParser(xml);
    const en = parser(rawXML);
    expect(en).toEqual(entities);
  });
  test('case 4', () => {
    const rawXML = XML7.split('\n')
      .slice(1)
      .join('\n');
    const xml = new DOMParser().parseFromString(rawXML, 'text/xml');
    const entities = iDParser(xml);
    const en = parser(rawXML);
    expect(en).toEqual(entities);
  });
  test('case 5', () => {
    const rawXML = XML8.split('\n')
      .slice(1)
      .join('\n');
    const xml = new DOMParser().parseFromString(rawXML, 'text/xml');
    const entities = iDParser(xml);
    const en = parser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
  test('big case 1', () => {
    const rawXML = XML9.split('\n')
      .slice(1)
      .join('\n');
    const xml = new DOMParser().parseFromString(rawXML, 'text/xml');
    const entities = iDParser(xml);
    const en = parser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
  test('big case 2', () => {
    const rawXML = BIG_XML1.split('\n')
      .slice(1)
      .join('\n');
    const xml = new DOMParser().parseFromString(rawXML, 'text/xml');
    const entities = iDParser(xml);
    const en = parser(rawXML);

    expect(equal(en, entities)).toBe(true);
  });
  test('big case 3', () => {
    const rawXML = BIG_XML3.split('\n')
      .slice(1)
      .join('\n');
    const xml = new DOMParser().parseFromString(rawXML, 'text/xml');
    const entities = iDParser(xml);
    const en = parser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
});
