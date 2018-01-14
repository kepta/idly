import equal = require('lodash.isequal');
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
import { legacyParser } from './legacyParser';

import smartParser from './';

describe('smart parser', () => {
  test('case 1', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(XML2, 'text/xml');
    const en = smartParser(XML2);
    const entities = legacyParser(xml).sort((a, b) => a.id.localeCompare(b.id));
    expect(en).toEqual(entities);
  });
  test('case 2', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(XML1, 'text/xml');
    const entities = legacyParser(xml).sort((a, b) => a.id.localeCompare(b.id));
    const en = smartParser(XML1).sort((a, b) => a.id.localeCompare(b.id));
    expect(en).toEqual(entities);
  });
  test('case 3', () => {
    const parser = new DOMParser();
    const rawXML = XML5.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(rawXML, 'text/xml');
    const entities = legacyParser(xml);
    const en = smartParser(rawXML);
    expect(en).toEqual(entities);
  });
  test('case 4', () => {
    const parser = new DOMParser();
    const rawXML = XML7.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(rawXML, 'text/xml');
    const entities = legacyParser(xml);
    const en = smartParser(rawXML);
    expect(en).toEqual(entities);
  });
  test('case 5', () => {
    const parser = new DOMParser();
    const rawXML = XML8.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(rawXML, 'text/xml');
    const entities = legacyParser(xml);
    const en = smartParser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
  test('big case 1', () => {
    const parser = new DOMParser();
    const rawXML = XML9.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(rawXML, 'text/xml');
    const entities = legacyParser(xml);
    const en = smartParser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
  test('big case 2', () => {
    const parser = new DOMParser();
    const rawXML = BIG_XML1.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(rawXML, 'text/xml');
    const entities = legacyParser(xml);
    const en = smartParser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
  test('big case 3', () => {
    const parser = new DOMParser();
    const rawXML = BIG_XML3.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(rawXML, 'text/xml');
    const entities = legacyParser(xml);
    const en = smartParser(rawXML);
    expect(equal(en, entities)).toBe(true);
  });
});
