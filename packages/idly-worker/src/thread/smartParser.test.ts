import {
  BIG_XML1,
  BIG_XML3,
  XML1,
  XML2,
  XML5,
  XML7,
  XML8,
  XML9,
} from '../misc/fixtures';
import { smartParser } from './smartParser';
import { xmlToEntities } from './xmlToEntities';

describe('smart parser', () => {
  test('case 1', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(XML2, 'text/xml');
    const en = smartParser(XML2);
    const entities = xmlToEntities(xml).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    expect(en).toEqual(entities);
  });
  test('case 2', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(XML1, 'text/xml');
    const entities = xmlToEntities(xml).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    const en = smartParser(XML1).sort((a, b) => a.id.localeCompare(b.id));
    expect(en).toEqual(entities);
  });
  test('case 3', () => {
    const parser = new DOMParser();
    const saneXML = XML5.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    const en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('case 4', () => {
    const parser = new DOMParser();
    const saneXML = XML7.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    const en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('case 5', () => {
    const parser = new DOMParser();
    const saneXML = XML8.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    const en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('case 6', () => {
    const parser = new DOMParser();
    const saneXML = XML9.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    const en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('big case 2', () => {
    const parser = new DOMParser();
    const saneXML = BIG_XML1.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    const en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
  test('big case 3', () => {
    const parser = new DOMParser();
    const saneXML = BIG_XML3.split('\n')
      .slice(1)
      .join('\n');
    const xml = parser.parseFromString(saneXML, 'text/xml');
    const entities = xmlToEntities(xml);
    const en = smartParser(saneXML);
    expect(en.slice(0)).toEqual(entities.slice(0));
  });
});
